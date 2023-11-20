import { add } from './modules/math';

console.log('you are ready to start coding typescript...');

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const main = document.createElement('div');
const child = document.createElement('p');
child.innerHTML = 'Hello';
main.appendChild(child);
root.appendChild(main);

import { sales, ISale, items, IItem, departments, IDept } from './data';
import { Maybe } from './maybe';

interface withSales {
  f01: string;
  f64: number;
  f65: number;
  sales: number;
  qty: number;
}

interface withSalesAndItem {
  f01: string;
  f64: number;
  f65: number;
  sales: number;
  qty: number;
  item: IItem;
}

interface withSalesAndItemWithDepartments {
  f01: string;
  f64: number;
  f65: number;
  sales: number;
  qty: number;
  item: IItem;
  department: IDept;
}

const unique = (sales: ISale[]) => {
  const newArray: ISale[] = [];
  const header: string[] = [];
  sales.forEach((sale) => {
    if (!header.includes(sale.f01)) {
      header.push(sale.f01);
      newArray.push(sale);
    } else {
      const index = newArray.findIndex((x) => x.f01 === sale.f01);
      if (index >= 0) {
        const newItem = { ...sale, sales: newArray[index].f65 + sale.f65, qty: newArray[index].f64 + sale.f64 };
        newArray.splice(index, 1, newItem);
      }
    }
  });
  return newArray;
};

const sorter = (a: withSales, b: withSales) => (a.f65 > b.f65 ? -1 : a.f65 < b.f65 ? 1 : 0);

const filtered = Maybe.just(sales)
  .map((x: ISale[]) => x.filter((y) => y.f254 >= new Date('7/1/2023')))
  .map((x: ISale[]) => x.filter((y) => y.f254 <= new Date('8/1/2023')))
  .map((x: ISale[]) => unique(x))
  .map((x: withSales[]) => x.sort(sorter))
  .map((x: withSales[]) => x.map((y) => ({ ...y, item: items.filter((i) => i.f01 === y.f01)[0] })))
  .map((x: withSalesAndItem[]) =>
    x.map((y) => ({ ...y, department: departments.filter((d) => d.f04 === y.item.f04)[0] }))
  );

console.log(filtered.extract());

interface withItem {
  f254: Date;
  f01: string;
  f64: number;
  f65: number;
  item: IItem;
}
interface withDepartment {
  f254: Date;
  f01: string;
  f64: number;
  f65: number;
  item: IItem;
  department: IDept;
}

const addItemDetail = (s: ISale) => ({ ...s, item: items.filter((i) => i.f01 === s.f01)[0] });
const addDepartmentDetail = (s: withItem) => ({ ...s, department: departments.filter((d) => d.f04 === s.item.f04)[0] });
const addDiscount = (s: withDepartment) => {
  if (s.item.f04 === 3) {
    const discount = s.f65 * 0.1;
    const newTotal = s.f65 - discount;
    return { ...s, discount, originalSales: s.f65, f65: newTotal };
  } else {
    return { ...s, discount: 0, originalSales: s.f65 };
  }
};
const chained = Maybe.chain(addItemDetail, addDepartmentDetail, addDiscount)(sales);
console.log(chained);
