// Bonus =====>
function func(nums) {
    let maxReach = 0; 

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false; 
        maxReach = Math.max(maxReach, i + nums[i]); 

        if (maxReach >= nums.length - 1) return true;
    }

    return false; 
} 
// Example 1 =====>
const nums1 = [2, 3, 1, 1, 4];
console.log(func(nums1));

// Example 2 =====>
const nums2 = [3, 2, 1, 0, 4];
console.log(func(nums2)); 

