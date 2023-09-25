import { Data, Pages, Items, VolumeInfo, GoogleUpdatedFields } from '../../types/googleBookTypes';

// should it throw an error if new data returns undefined?

export default function createUniqueDataSets(data: Data<any>) {
   // : Array<Items<Record<string, string>>>
   if (!data) return;
   const _data = data?.pages;
   // have all data into one single array
   const newData = _data?.map((page) => page?.items).flatMap((item) => item?.map((i) => i));

   return createUniqueData(newData);
}

export function createUniqueData<TData extends Pages<any> | Items<any>[]>(data: TData) {
   if (!data || Array.isArray(data)) {
      return;
   }
   let newData;

   const flatArray = (data: Pages<any>) => {
      return data.items.flatMap((item) => item);
   };

   const dataArray = 'items' in data ? flatArray(data) : (data as Items<any>[]);

   // simpler way of defining this w/ less code:
   return dataArray.reduce((arr: Items<any>[], curr) => {
      if (!arr.some((idx) => idx.id === curr.id)) {
         arr.push(curr);
      }
      return arr;
   }, []);

   // if ('items' in data) {
   //    console.log('should be running here');
   //    newData = data.items
   //       .flatMap((item) => item)
   //       .reduce((arr: Items<any>[], curr) => {
   //          if (!arr.some((idx) => idx.id === curr.id)) {
   //             arr.push(curr);
   //          }
   //          return arr;
   //       }, []);
   // } else {
   //    newData = data.reduce((arr: Items<any>[], curr) => {
   //       if (!arr.some((idx) => idx.id === curr.id)) {
   //          arr.push(curr);
   //       }
   //       return arr;
   //    }, []);
   // }

   // return newData;
}

// this should be the default export and change
// across the field
function convertDataToStrings(data: Data<any>) {
   const arrayData = createUniqueDataSets(data);
   return arrayData && arrayData[0].toString();
}
