# Firestore Typed

## What it is?
Firestore Typed is a type wrapper for [firebase 9 web sdk]([/guides/content/editing-an-existing-page](https://www.npmjs.com/package/firebase)), specifically targeting the firestore module. It allows for type checking filters and more based on a simple configuration.

&nbsp;
## Installation Guide
- Install the firebase package dependency:
    ```
    $ npm install firebase@9
    ```
- Install the firestore-typed package:
    ```
    $ npm install -D firestore-typed
    ```

## Configuration
- Import firestore-typed into a declaration (d.ts) or regular ts file:
    ```ts
    import "firestore-typed";
    ```
- Import your document models:
    ```ts
    /* 
        interface City { name:string; mayor: Person; } 
        interface Person { name:string; } <- a nested object
    */
    import { City } from './models/city';

    /* interface CityCenters { name:string;  code: number; } */
    import { CityCenters } from './models/city'; 
    ```
- Declare you firestore paths 
    ```ts
    declare global {
        type FirestorePaths = {
            cities: City;
            ["cities/cityCenters"]: CityCenter; // <- to express a sub collection
        }
    }
    ```
## Usage
- Simply use firebase as you'd normally do:
    ```ts
    import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';

    const getCities = async () =>
        getDocs(
            query(
                collection(getFirestore(), "cities")
                , where("mayor", "==", {name: "Barack Obama"})
                , orderBy("mayor.name")
            ));
    ```
    
- But now you'll enjoy based solely on the collection path:
  - Autocomplete for paths:
    
    ![Path Autocomplete](/images/autocomplete-paths.png)

  - Autocomplete filters for property type:
  
    ![Filter Autocomplete](/images/autocomplete-filters.png)

  - Checks for the above:
    
    ![Checking Paths](/images/invalid-path.png)
    
    ![Checking Filter](/images/invalid-filter.png)
  
  - Type checking for property values
    
    ![Checking Value](/images/invalid-value.png)


