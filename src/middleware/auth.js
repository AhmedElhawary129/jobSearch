import {  tokenTypes } from "../DB/enums.js";
import {userModel} from "../DB/models/index.js";
import { AppError, asyncHandler } from "../utils/error/index.js";
import {  verifyToken} from "../utils/index.js";



export const decodedToken = async({authorization, tokenType, next}) => {
  const [prefix, token] = authorization?.split(" ") || [];
  if (!prefix || !token) {
    return next(
      new AppError("authentication toke is required !!", 401)
    );
  }
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;
  if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else if (prefix == process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else {
    return next(new AppError("Invalid token prefix", 401));
  }
  const decoded = await verifyToken({
    token, 
    SIGNATURE : tokenType == tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE
  });

  if (!decoded?.id) {
    return next(new AppError("Invalid token payload", 403));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  if (parseInt(user?.changePasswordAt?.getTime()/1000) >= decoded.iat) {
    return next(new AppError("Token Expired please logIn again", 401))
  }
  return user;
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({authorization, tokenType : tokenTypes.access, next})

  req.user = user;
  next();
});

//------------------------------------------------------------------------------------------------------------------------------------------

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  });
};