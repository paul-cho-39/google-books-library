import { Data, Pages, Items, VolumeInfo, GoogleUpdatedFields } from '../../types/googleBookTypes';

// should it throw an error if new data returns undefined?

export default function createUniqueDataSets(data: Data<any>) {
   // : Array<Items<Record<string, string>>>
   if (!data) return;
   const _data = data?.pages;
   // have all data into one single array
   const newData = _data?.map((page) => page?.items).flatMap((item) => item);

   return createUniqueData(newData);
}

export function createUniqueData<TData extends Pages<any> | Items<any>[]>(data: TData) {
   if (!data || !Array.isArray(data)) {
      return;
   }
   const flatArray = (data: Pages<any>) => {
      console.log('flat mapped');
      return data.items.flatMap((item) => item);
   };

   const dataArray = 'items' in data ? flatArray(data as Pages<any>) : (data as Items<any>[]);

   return dataArray.reduce((arr: Items<any>[], curr) => {
      if (curr && !arr.some((idx) => idx.id === curr.id)) {
         arr.push(curr);
      }
      return arr;
   }, []);
}

// this should be the default export and change
// across the field
function convertDataToStrings(data: Data<any>) {
   const arrayData = createUniqueDataSets(data);
   return arrayData && arrayData[0].toString();
}
