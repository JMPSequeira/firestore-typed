import { collection, doc, getFirestore, orderBy, query, where } from "firebase/firestore";
import { QueryConstraint } from '../..';
interface City {
    name: string,
    nested: NestedCity;
    nestedValues: string[];

}
interface NestedCity {
    name: string;
    age: number;
}

const constraintTester = <T>(q: QueryConstraint<T>) => q;

const whereValidTopPropertyFilter = constraintTester<City>(where("name", "<", "value"));
//@ts-expect-error
const whereInvalidTopPropertyName = constraintTester<City>(where("fake", "array-contains", "12"));

const whereValidNestedPropertyFilter = constraintTester<City>(where("nested.age", "<", 12));
//@ts-expect-error
const whereTopPropertyInvalidFilter = constraintTester<City>(where("name", "array-contains", "12"));

const whereValidTopPropertyArrayFilter = constraintTester<City>(where("nestedValues", "array-contains", "12"));
//@ts-expect-error
const whereTopPropertyInvalidValue = constraintTester<City>(where("name", "==", 12));

const orderByValidTopProperty = constraintTester<City>(orderBy("name"));
//@ts-expect-error
const orderByInvalidTopPropertyName = constraintTester<City>(orderBy("fake"));

