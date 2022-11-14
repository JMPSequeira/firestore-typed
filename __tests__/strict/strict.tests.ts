import { collection, doc, getFirestore, MappedCollectionReference, MappedDocumentReference, orderBy, query, where } from "firebase/firestore";
import { PreparePath, QueryConstraint } from '../..';




const aValidCollectionWithSegments: MappedCollectionReference<City, "cities"> = collection(firestore, "cities");
const aValidCollectionWithCompileConstant: MappedCollectionReference<City, "cities"> = collection(firestore, citiesPath);
const aValidCollectionWithTralingSlash: MappedCollectionReference<City, "cities"> = collection(firestore, "cities/");
const aValidCollectionWithLeadingSlash: MappedCollectionReference<City, "cities"> = collection(firestore, "/cities");
const aValidCollectionWithLeadingAndTrailingSlash: MappedCollectionReference<City, "cities"> = collection(firestore, "/cities/");
const aValidDocWithSegments: MappedDocumentReference<City, "cities"> = doc(firestore, "cities", "anId");
const aValidDocWithCompileConstant: MappedDocumentReference<City, "cities"> = doc(firestore, citiesPath, "anId");
const aValidDocWithCompileConstantAndDocUnion: MappedDocumentReference<City, "cities"> = doc(firestore, citiesPath, docUnion);
const aValidDocWithComposedPath: MappedDocumentReference<City, "cities"> = doc(firestore, "cities/anId");
const aValidDocWithTralingSlash: MappedDocumentReference<City, "cities"> = doc(firestore, "cities/", "anId/");
const aValidDocWithLeadingSlash: MappedDocumentReference<City, "cities"> = doc(firestore, "/cities", "/anId");
const aValidDocWithLeadingAndTrailingSlash: MappedDocumentReference<City, "cities"> = doc(firestore, "/cities/", "/anId/");
const aValidDocWithCollectionAsStartingPoint: MappedDocumentReference<City, "cities"> = doc(citiesRef, "anId");
const aValidDocWithComposedPathAndSegments: MappedDocumentReference<NestedCity, "cities/nested"> = doc(firestore, "cities/anId", "nested/anId");
const aValidDocWithComposedPathAndSegmentsAndDocUnion: MappedDocumentReference<NestedCity, "cities/nested"> = doc(firestore, `cities/${docUnion}`, `nested/${docUnion}`);
const aValidDocWithNestedCollectionAsStartingPoint: MappedDocumentReference<NestedCity, "cities/nested"> = doc(nestedRef, "anId");
const aValidNestedCollectionWithSegments: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, "cities", "anId", "nested");
const aValidNestedCollectionWithCompileConstant: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, citiesPath, "anId", nestedPath);
const aValidNestedCollectionWithComposedPath: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, "cities/anId/nested");
const aValidNestedCollectionWithTralingSlash: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, "cities/", "anId/", "nested/");
const aValidNestedCollectionWithLeadingSlash: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, "/cities", "/anId", "/nested");
const aValidNestedCollectionWithLeadingAndTrailingSlash: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, "/cities/", "/anId/", "/nested/");
const aValidNestedCollectionWithDocUnion: MappedCollectionReference<NestedCity, "cities/nested"> = collection(firestore, "/cities/", docUnion, "/nested/");
const aValidNestedCollectionWithCollectionAsStartingSegment: MappedCollectionReference<NestedCity, "cities/nested"> = collection(citiesRef, "anId", "nested");
const aValidNestedCollectionWithDocAsStartingSegment: MappedCollectionReference<NestedCity, "cities/nested"> = collection(docRef, "nested");

const nullParent: null = citiesRef.parent;
const cityParent: MappedCollectionReference<City, "cities"> = docRef.parent;
const cityDocParent: MappedDocumentReference<City, "cities"> = nestedRef.parent;









