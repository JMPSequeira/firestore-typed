import { Mapped, MappedCollection, MappedDocument, Firestore } from "firebase/firestore";
import "../../index";


declare global {
    const citiesPath = "cities";
    const nestedPath = "nested";
    const docUnion: "one" | "two";
    const docPlaceN: number;
    const citiesRef: MappedCollection<City, "cities">;
    const nestedRef: MappedCollection<NestedCity, "cities/nested">;
    const docRef: MappedDocument<City, "cities">;

    const firestore: Firestore;

    type FirestoreConfig = {
        cities: City,
        "cities/nested": NestedCity
    }

}