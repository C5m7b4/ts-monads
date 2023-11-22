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

function exists<T>(val: T): val is Exclude<T, null | undefined> {
  return val !== undefined && val !== null;
}

console.log('****************** option');
import { Option, Some, None } from './option';

function divide(numerator: number, denominator: number): Option<number> {
  if (denominator === 0) {
    return None;
  } else {
    return Some(numerator / denominator);
  }
}

const result = divide(2, 0);
const message = result.match({
  some: (res) => `result is ${res}`,
  none: 'cannot divide by zero',
});

console.log(message);

type Drink = {
  name: string;
  color: string;
  caffineCount: number;
};

const drinks: Drink[] = [
  {
    name: 'coffee',
    color: 'black',
    caffineCount: 25,
  },
  {
    name: 'mt dew',
    color: 'clear',
    caffineCount: 0,
  },
];

const lookupCaffineCount = (name: string, drinks: Drink[]): Option<Drink> => {
  const drink = drinks.find((d) => d.name === name);
  if (exists(drink)) {
    if (exists(drink.caffineCount)) {
      return Some(drink);
    }
  } else {
    return None;
  }

  return None;
};

const caffineResult = lookupCaffineCount('mt dew', drinks);
const caffineMessage = caffineResult.match({
  none: 'no caffine in this drink',
  some: (drink) => `found ${drink.caffineCount} in ${drink.name}`,
});

console.log(caffineMessage);

console.log('***************** users');

interface User {
  firstName: string;
  lastName?: string;
  nickname?: string;
}

const users: User[] = [
  {
    firstName: 'mike',
    lastName: 'bedingfield',
    nickname: 'c5',
  },
  {
    firstName: 'tommy',
  },
];

const concateNames = (user: User): Option<string> =>
  !exists(user.firstName) || !exists(user.lastName) ? None : Some(`${user.firstName} ${user.lastName}`);

const filteredUsers = Maybe.just(users).map((x: User[]) =>
  x.map((y) => ({
    ...y,
    fullName: concateNames(y).match({
      none: 'there is no fullname. maybe a firstname or lastname is missing, please check',
      some: (res) => res,
    }),
  }))
);

console.log(filteredUsers.extract());

let x: Option<number> = Some(2);
console.log(x.isSome());
let y: Option<number> = None;
console.log(y.isSome());

function expect(value: any) {
  return {
    toEqual: function (expected: any) {
      if (value === expected) {
        return true;
      } else {
        return false;
      }
    },
  };
}

console.log('*************** expects');
console.log(expect(Some(2).isSome()).toEqual(true));
console.log(expect(Some().isSome()).toEqual(false));
console.log(expect(Some(undefined).isSome()).toEqual(false));
console.log(expect(Some(null).isSome()).toEqual(true));

console.log(expect(Some(2).isNone()).toEqual(false));
console.log(expect(None.isNone()).toEqual(true));

let air = Some('air');
console.log(air.unwrap());
let n = None;
//console.log(n.unwrap());

import { IsSome } from './option';

function getName(name: Option<string>): string {
  if (IsSome(name)) {
    return name.unwrap();
  } else {
    return 'N/A';
  }
}

console.log(getName(Some('mike')));

console.log('********** 3 new friends');
// andThem
const sqrt = (x: number): Option<number> => Some(x * x);
const nope = (_: number): Option<number> => None;

console.log(Some(2).andThen(sqrt).andThen(sqrt).unwrap());
console.log(Some(2).andThen(sqrt).andThen(nope).isNone());
console.log(Some(2).andThen(nope).andThen(sqrt).isNone());
console.log(None.andThen(sqrt).andThen(sqrt).isNone());

console.log('******************** or');
let a = Some(2);
let b = None;
console.log(a.or(b).unwrap());

let c = None;
let d = Some(100);
console.log(c.or(d).unwrap());

let e = Some(2);
let f = Some(100);
console.log(e.or(f).unwrap());

let h: Option<number> = None;
let i = None;
console.log(h.or(i).isNone());

console.log('************************* and');
let j = Some(2);
let k = None;
console.log(j.and(k).isNone());
// if first value is nothig then nothing
// else if it is something then return the second value
// ????????????????????

let l = None;
let m = Some(100);
console.log(l.and(m).isNone());

let o = Some(1);
let p = Some(100);
console.log(o.and(p).unwrap());

let q: Option<number> = None;
let r = None;
console.log(q.and(r).isNone());
