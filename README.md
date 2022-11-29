# StrongStore 

&nbsp;
## What it is?

StrongStore is a type wrapper for [firebase 9 web sdk]([/guides/content/editing-an-existing-page](https://www.npmjs.com/package/firebase)), specifically targeting the firestore module redeclaring the necessary functions in order to provide a typed 
firestore. 

It allows for autocomplete and type checking based on a simple configuration.

&nbsp;
## Installation Guide
______________
&nbsp;
- Install the firebase package dependency:
    ```
    $ npm install firebase@9
    ```
- Install the strongstore package:
    ```
    $ npm install -D strongstore
    ```

&nbsp;
## Configuration
__________
&nbsp;

StrongStore redeclares functions in 'firebase/firestore' so if you compile with '--skipLibCheck false' it will throw a redeclare error for each one of those functions. 

&nbsp;
- Import StrongStore into a declaration (d.ts) file (I personally call it data.d.ts):
    ```ts
    import "strongstore";
    ```

&nbsp;
### Modes
&nbsp;

StrongStore works in two mutually exclusive ways: Typed or Strict.

&nbsp;
#### Typed Mode (*No extra configuration needed*)
&nbsp;

- Simply use firebase as you'd normally do:
    ```ts
    import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
    ```
- Import your document models:
    ```ts
    /* 
        interface City { name:string; mayor: Person; } 
        interface Person { name:string; nicknames: string[]; } <- a nested object
    */
    
    import { City } from '/models/city';
    ```
- Enjoy the features provided: <img src="https://github.com/JMPSequeira/strongstore/blob/master/images/typed-mode.png?raw=true" alt="drawing" width="1000"/>

&nbsp;

#### Strict Mode
&nbsp;
Strict Mode relies on a declared global type called FirestoreConfig. If it does not exist it defaults to Typed Mode. 
Strict Mode is ...strict. Only configured collections will work.
- Import your data models in the same file you imported StrongStore:
    ```ts
    /* 
        interface City { name:string; }

        interface Attraction { type: "Park" | "Station" | "Monument"}
    */
    
    import { City } from '/models/city';
    import { Attraction } from '/models/attraction';
    ```
- Declare FirestoreConfig in global declaration:
    ```ts
    declare global {
        type FirestoreConfig = {
            cities: City;
            ["cities/attractions"]: Attraction; // <- to express a sub collection
        }
    }
    ```

- All features from Typed Mode will work but now instead of casting you'll pass a path to a collection or document and it will resolve a:
  - MappedCollection<T, Key> (extends CollectionReference<T>) 
  - or MappedDocument<T, Key> (extends DocumentReference<T>):
  ```ts
  const firestore = getFirestore();

  //      ↓ MappedCollection<City, "cities">
  const citiesCollection = collection(firestore,"cities");

  //      ↓ MappedDocument<City, "cities">
  const nyDoc = doc(firestore,"cities/NY");

  //      ↓ MappedCollection<City, "cities">
  const citiesCollection = nyDoc.parent;

  //      ↓ null
  const nullParent = citiesCollection.parent;
  ``` 
- Besides the explicit path, you can use:
  ```ts
  //      ↓ MappedCollection<Attraction, "cities/attractions
  const nyAttractions = collection(firestore,"cities", "NY", "attractions");
  //      is the same as
  const nyAttractions = collection(cities,"NY/attractions");
  //      is the same as
  const nyAttractions = collection(cities,"NY", "attractions");
  //      is the same as
  const nyAttractions = collection(cities,"NY/", "/attractions"); // <= trims leading and trailing '/'
  //      is the same as
  const nyAttractions = collection(nyDoc,"attractions");
  ```
- You can even use string templates, or variables, for path segments:
  - For collection segments, as long as it's resolvable to a compile time constant:
   ```ts
  const citiesPath = "cities";
  //      ↓ MappedCollection<Attraction, "cities/attractions
  const nyAttractions = collection(firestore,citiesPath, "NY", "attractions");
  //      is the same as
  const nyAttractions = collection(firestore,`${citiesPath}/NY/attractions`);
  ```
  - For document segments:
  ```ts
  // BE CAREFUL NOT TO PASS A SLASH
  function getNyCityAttractions(id: string) : Promise<QuerySnapshot<Attraction>> {
    
    //      ↓ MappedCollection<Attraction, "cities/attractions
    const nyAttractions = collection(firestore,"cities", id, "attractions");
    //      is the same as
    const nyAttractions = collection(firestore,`cities/${id}/attractions`);

    return getDocs(nyAttractions);
  }

  function getNyCityAttractions(union: "NY" | "LA") : Promise<QuerySnapshot<Attraction>> {
    
    //      ↓ MappedCollection<Attraction, "cities/attractions
    const nyAttractions = collection(firestore,"cities", union, "attractions");
    //      is the same as
    const nyAttractions = collection(firestore,`cities/${union}/attractions`);

    return getDocs(nyAttractions);
  }
  ```


