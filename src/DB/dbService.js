export const create = async({model, query = {}} = {}) => {
    return await model.create(query);
}


export const findOne = async({model, filter = {}, select = "", populate = [], skip = 0, limit = 100} = {}) => {
    return await model.findOne(filter).select(select).populate(populate).skip(skip).limit(limit);
}


export const find = async({model, filter = {}, select= "", populate = [], skip = 0, limit = 100} = {}) => {
    return await model.find(filter).select(select).populate(populate).skip(skip).limit(limit);
}


export const updateOne = async({model, filter = {}, update = {}} = {}) => {
    return await model.updateOne(filter, update);
}


export const deleteOne = async({model, filter = {}} = {}) => {
    return await model.deleteOne(filter, update);
}


export const deleteMany = async({model, filter = {}} = {}) => {
    return await model.deleteMany(filter, update);
}


export const findOneAndUpdate = async({model, filter = {}, select= "", update = {}, options = {new : true}, populate = []} = {}) => {
    return await model.findOneAndUpdate(filter, update, options).select(select).populate(populate);
}


export const findByIdAndUpdate = async({model, filter = {}, select= "", update = {}, options = {new : true}, populate = []} = {}) => {
    return await model.findOneAndUpdate(filter, update, options).select(select).populate(populate);
}
