import { collection, doc, MappedCollection, MappedDocument } from "firebase/firestore";

// resolve 
const aValidCollectionWithSegments: MappedCollection<City, "cities"> = collection(firestore, "cities");
const aValidCollectionWithCompileConstant: MappedCollection<City, "cities"> = collection(firestore, citiesPath);
const aValidCollectionWithTrailingSlash: MappedCollection<City, "cities"> = collection(firestore, "cities/");
const aValidCollectionWithLeadingSlash: MappedCollection<City, "cities"> = collection(firestore, "/cities");
const aValidCollectionWithLeadingAndTrailingSlash: MappedCollection<City, "cities"> = collection(firestore, "/cities/");
const aValidDocWithSegments: MappedDocument<City, "cities"> = doc(firestore, "cities", "anId");
const aValidDocWithCompileConstant: MappedDocument<City, "cities"> = doc(firestore, citiesPath, "anId");
const aValidDocWithCompileConstantAndDocUnion: MappedDocument<City, "cities"> = doc(firestore, citiesPath, docUnion);
const aValidDocWithComposedPath: MappedDocument<City, "cities"> = doc(firestore, "cities/anId");
const aValidDocWithTrailingSlash: MappedDocument<City, "cities"> = doc(firestore, "cities/", "anId/");
const aValidDocWithLeadingSlash: MappedDocument<City, "cities"> = doc(firestore, "/cities", "/anId");
const aValidDocWithLeadingAndTrailingSlash: MappedDocument<City, "cities"> = doc(firestore, "/cities/", "/anId/");
const aValidDocWithCollectionAsStartingPoint: MappedDocument<City, "cities"> = doc(citiesRef, "anId");
const aValidDocWithComposedPathAndSegments: MappedDocument<NestedCity, "cities/nested"> = doc(firestore, "cities/anId", "nested/anId");
const aValidDocWithComposedPathAndSegmentsAndDocUnion: MappedDocument<NestedCity, "cities/nested"> = doc(firestore, `cities/${docUnion}`, `nested/${docUnion}`);
const aValidDocWithNestedCollectionAsStartingPoint: MappedDocument<NestedCity, "cities/nested"> = doc(nestedRef, "anId");
const aValidNestedCollectionWithSegments: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, "cities", "anId", "nested");
const aValidNestedCollectionWithCompileConstant: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, citiesPath, "anId", nestedPath);
const aValidNestedCollectionWithComposedPath: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, "cities/anId/nested");
const aValidNestedCollectionWithTrailingSlash: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, "cities/", "anId/", "nested/");
const aValidNestedCollectionWithLeadingSlash: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, "/cities", "/anId", "/nested");
const aValidNestedCollectionWithLeadingAndTrailingSlash: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, "/cities/", "/anId/", "/nested/");
const aValidNestedCollectionWithDocUnion: MappedCollection<NestedCity, "cities/nested"> = collection(firestore, "/cities/", docUnion, "/nested/");
const aValidNestedCollectionWithCollectionAsStartingSegment: MappedCollection<NestedCity, "cities/nested"> = collection(citiesRef, "anId", "nested");
const aValidNestedCollectionWithDocAsStartingSegment: MappedCollection<NestedCity, "cities/nested"> = collection(docRef, "nested");



//navigation
const nullParent: null = citiesRef.parent;
const cityParent: MappedCollection<City, "cities"> = docRef.parent;
const cityDocParent: MappedDocument<City, "cities"> = nestedRef.parent;


//errors
//@ts-expect-error
const doubleSlash: MappedCollection<City, "cities"> = collection(firestore, "/cities//");
//@ts-expect-error
const incorrectLengthCollection: MappedCollection<City, "cities"> = collection(firestore, "/cities/a");
//@ts-expect-error
const incorrectLengthDocument: MappedDocument<City, "cities"> = doc(firestore, "/cities/");
//@ts-expect-error
const invalidPath: MappedCollection<City, "cities"> = collection(firestore, "citiesa");
//@ts-expect-noerror
const validStringIfDocumentPart: MappedDocument<City, "cities"> = doc(firestore, "cities", aString);
//@ts-expect-noerror
const validStringIfDocumentPartMultiple: MappedDocument<NestedCity, "cities"> = doc(firestore, "cities", aString, "nested", aString);
//@ts-expect-error
const invalidStringIfCollectionPart: MappedDocument<NestedCity, "cities"> = doc(firestore, "cities", aString, aString, "irrelevant");









