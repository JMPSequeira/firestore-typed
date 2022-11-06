
import * as Firestore from "@firebase/firestore";

declare module "@firebase/firestore" {
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export interface QueryConstraint<T extends Doc> extends Firestore.QueryConstraint {

    }
    //@ts-ignore 
    export const where: <T extends Doc, P extends FilterProps<T>, F extends FiltersOf<UnNestType<T, P>>>(
        fieldPath: P
        , opStr: F
        , value: PropFilterValues<F, UnNestType<T, P>>) => Firestore.QueryConstraint<T>;

    //@ts-ignore
    export const orderBy: <T extends Doc, P extends FilterProps<T>>(
        fieldPath: P
        , directionStr?: Firestore.OrderByDirection) => Firestore.QueryConstraint<T>;

    //@ts-ignore
    export const collection: (<P extends string, T = CollectionTypeFromPath<CollectionPath<P>>>(
        firestore: Firestore.Firestore
        , path: P) => Firestore.CollectionReference<T>)
        | (<P extends string, T = Doc>(
            firestore: Firestore.Firestore
            , path: P
            , ...pathSegments: P[]) => Firestore.CollectionReference<T>);

    //@ts-ignore
    export const doc: (<P extends string, T = CollectionTypeFromPath<CollectionPath<P>>>(
        firestore: Firestore.Firestore
        , path: P) => Firestore.DocumentReference<T>)
        | (<P extends string, T = Doc>(
            firestore: Firestore.Firestore
            , path: P
            , ...pathSegments: P[]) => Firestore.DocumentReference<T>);

    //@ts-ignore
    export const query: <T extends Doc>(query: Firestore.Query<T>, ...queryConstraints: QueryConstraint<NoInfer<T>>[]) => Firestore.Query<T>;
}


type FirestorePaths = _;

type NoInfer<T> = T extends infer S ? S : never;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Doc { }

type DeepKeysNoArrays<T> =
    object extends T ? string :
    T extends readonly unknown[] ? never :
    T extends object ? keyof T & string | DeepSubKeysNoArrays<T, keyof T & string> :
    never;

type DeepSubKeysNoArrays<T, K extends string> = K extends keyof T ? `${K}.${DeepKeysNoArrays<T[K]>}` : never;

type FilterProps<T extends Doc> = DeepKeysNoArrays<T>;
type EqualityFilters = "==" | "!=";
type RangeFilters = "<" | "<=" | ">=" | ">";
type ArrayFilters = "array-contains" | "array-contains-any";
type ExistsFilters = "in" | "not-in";

type FiltersOf<P> =
    P extends _[]
    ? ArrayFilters | EqualityFilters | ExistsFilters
    : NonNullable<P> extends object
    ? EqualityFilters | ExistsFilters
    : EqualityFilters | ExistsFilters | RangeFilters
    ;

type PropFilterValues<F, T> =
    F extends ExistsFilters
    ? RangedTuple<NotUndefined<T> | null, 10, 1>
    : F extends 'array-contains'
    ? ArrayType<NotUndefined<T> | null>
    : F extends 'array-contains-any'
    ? RangedTuple<ArrayType<NotUndefined<T> | null>, 10, 1>
    : F extends "!=" ? (NotUndefined<T> | null | false)
    : NotUndefined<T> | null

type NotUndefined<T> = Exclude<T, undefined>;

type ArrayType<T> = T extends (infer I)[] ? I : never;

type Decrement<N extends number> = ArrayRepeat<N> extends [_, ...infer U] ? U['length'] : never

type RangedTuple<T, Max, Min = 0> = Max extends Min
    ? ArrayRepeat<Max, T>
    : ArrayRepeat<Min, T> | RangedTuple<T, Max, Inc<Min>>
    ;

type ArrayRepeat<N, D = _, T extends D[] = []> = T['length'] extends N ? T : ArrayRepeat<N, D, [...T, D]>;

type Inc<N> = [...ArrayRepeat<N>, unknown]['length'];

type UnNestType<T extends object, N extends string> = N extends `${infer P}.${infer R}`
    //@ts-ignore
    ? UnNestType<T[P] extends object ? T[P] : never, R> : T[N];

type Invalid<M> = Error & M;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _ = any;

type PathType<T extends string, M extends Mode = "collection", C = 0> = C extends 100 ? Invalid<"Maximum sub-collection depth is 100"> : T extends `${_}/${infer R}` ? PathType<R, Switch<M>, Inc<C>> : M;

type Switch<T extends Mode> = T extends "collection" ? "document" : T extends "document" ? "collection" : never;

type Mode = "collection" | "document";

type CollectionPath<T extends string> = PathType<T> extends "collection" ? Path<T> : Invalid<"Path represents a document">;


type Path<T extends string, M extends Mode = 'collection'> =
    T extends `${infer L}/${infer R}`
    ? (M extends "collection" ? `${L}${Path<R, Switch<M>>}` : `/${Path<R, Switch<M>>}`)
    : (M extends "document" ? "" : T)
    ;

type CollectionTypeFromPath<T> = T extends keyof FirestorePaths ? FirestorePaths[T] : unknown;