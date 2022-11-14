import { Firestore, MappedCollectionReference, MappedDocumentReference } from 'firebase/firestore';
import "../../index";


declare global {
    declare const citiesPath = "cities";
    declare const nestedPath = "nested";
    declare const docUnion: "one" | "two";
    declare const docPlaceN: number;
    declare const citiesRef: MappedCollectionReference<City, "cities"> = null!;
    declare const nestedRef: MappedCollectionReference<NestedCity, "cities/nested">;
    declare const docRef: MappedDocumentReference<City, "cities">;

    declare const firestore: Firestore;

    type FirestoreConfig = {
        cities: City,
        "cities/nested": NestedCity
    }

}