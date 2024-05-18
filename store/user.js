// store/user.ts
import { defineStore } from 'pinia'

function mergeObjects(obj1, obj2) {
  const mergedObj = {};

  // Function to merge categoryHistory arrays while removing duplicates
  const mergeCategoryHistory = (arr1, arr2) => {
    const mergedArray = [...arr1];
    for (let item of arr2) {
      if (!mergedArray.some(elem => elem.id === item.id)) {
        mergedArray.push(item);
      }
    }
    return mergedArray;
  };

  // Merge properties from obj1
  for (let key in obj1) {
    if (key === 'categoryHistory' && Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      // If key is 'categoryHistory' and both values are arrays, merge them
      mergedObj[key] = mergeCategoryHistory(obj1[key], obj2[key]);
    } else {
      mergedObj[key] = obj1[key];
    }
  }

  // Merge properties from obj2
  for (let key in obj2) {
    if (!(key in obj1)) {
      // If key doesn't exist in obj1, copy it from obj2
      mergedObj[key] = obj2[key];
    }
  }

  return mergedObj;
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: JSON.parse(localStorage.getItem('userInfo')) || {
      categoryHistory: []
    }
  }),
  actions: {
    async setLastCategory(categoryName, categoryId) {
      this.user.categoryHistory.push({ name: categoryName, id: categoryId })
      this.updateLocalStorage(await this.user)
      console.log(await this.user)
      return await this.user
    },
    updateLocalStorage(data = {}) {
      const currentData = JSON.parse(localStorage.getItem('userInfo'))
      if (currentData) {
        const mergedData = mergeObjects(data, currentData)
        localStorage.removeItem('userInfo')
        localStorage.setItem('userInfo', JSON.stringify(mergedData))
      } else {
        localStorage.setItem('userInfo', JSON.stringify(data))
      }
    }
  }
})
