
import * as Firestore from "@firebase/firestore";

//@ts-ignore
interface QueryConstraint<T>
    //@ts-ignore
    extends Firestore.QueryConstraint {
}
declare module "firebase/firestore" {


    type ParentDoc<P extends string> =
        Split<P, "/"> extends infer V
        ? (V extends [string]
            ? null
            : (V extends string[]
                ? MappedDocumentReference<TypeFromPath<StrConcat<Pop<V>, "/">>, StrConcat<Pop<V>, "/">>
                : never
            )
        )
        : never
        ;

    interface MappedCollectionReference<T, P extends string>
        extends Firestore.CollectionReference<T> {
        parent: ParentDoc<P>
    }


    interface MappedDocumentReference<T, P extends string>
        extends Firestore.DocumentReference<T> {
        parent: MappedCollectionReference<T, P>
    }

    function typedCollection
        <
            T = UnresolvedDocument
        >
        (
            firestore: Firestore.Firestore
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.CollectionReference<T>;

    function typedCollection
        <
            T = UnresolvedDocument
        >
        (
            reference: Firestore.CollectionReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.CollectionReference<T>;

    function typedCollection
        <
            T = UnresolvedDocument
        >
        (
            reference: Firestore.DocumentReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.CollectionReference<T>

    function typedDocument
        <
            T = UnresolvedDocument
        >
        (
            firestore: Firestore.Firestore
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.DocumentReference<T>;

    function typedDocument
        <
            T = UnresolvedDocument
        >
        (
            reference: Firestore.DocumentReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.DocumentReference<T>;

    function typedDocument
        <
            T = UnresolvedDocument
        >
        (
            reference: Firestore.CollectionReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.DocumentReference<T>

    function strictCollection
        <
            P extends string
            , A extends string[]
            , T = CollectionTypeFromSegments<[P, ...A]>
        >(
            firestore: Firestore.Firestore
            , path: P
            , ...pathSegments: A
        )
        : MappedCollectionReference<T, Path<StrConcat<[P, ...A], "/">>>;

    function strictCollection
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends Concat<Split<P1, "/">, Split<Path<StrConcat<[P2, ...A], "/">, "document">, "/">>
            , R extends CollectionTypeFromSegments<PS>
        >
        (
            reference: MappedCollectionReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        : MappedCollectionReference<R, Path<StrConcat<PS, "/">>>;

    function strictCollection
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends Concat<Split<P1, "/">, Split<Path<StrConcat<[P2, ...A], "/">>, "/">>
            , R extends CollectionTypeFromSegments<PS>
        >
        (
            reference: MappedDocumentReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        : MappedCollectionReference<R, Path<StrConcat<PS, "/">>>;



    function strictDocument
        <
            P extends string
            , A extends string[]
            , T = DocumentTypeFromSegments<[P, ...A]>
        >(
            firestore: Firestore.Firestore
            , path: P
            , ...pathSegments: A
        )
        : MappedDocumentReference<T, Path<StrConcat<[P, ...A], "/">, "document">>;

    function strictDocument
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends Concat<Split<P1, "/">, Split<Path<StrConcat<[P2, ...A], "/">>, "/">>
            , R extends DocumentTypeFromSegments<PS>
        >
        (
            reference: MappedDocumentReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        : MappedDocumentReference<R, Path<StrConcat<PS, "/">>>;

    function strictDocument
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends Concat<Split<P1, "/">, Split<Path<StrConcat<[P2, ...A], "/">, "document">, "/">>
            , R extends DocumentTypeFromSegments<PS>
        >
        (
            reference: MappedDocumentReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        : MappedDocumentReference<R, Path<StrConcat<PS, "/">>>;

    //@ts-ignore
    type Collection = Equals<FirestorePaths, any> extends false ? typeof strictCollection : typeof typedCollection;

    //@ts-ignore
    type Doc = Equals<FirestorePaths, any> extends false ? typeof strictDocument : typeof typedDocument;

    //@ts-ignore
    let doc: Doc;

    //@ts-ignore
    let collection: Collection;

    //@ts-ignore
    const where: <T extends object, P extends FilterProps<T>, F extends FiltersOf<UnNestType<T, P>>>(
        fieldPath: P
        , opStr: F
        , value: PropFilterValues<F, UnNestType<T, P>>) => QueryConstraint<T>;

    //@ts-ignore
    const orderBy: <T, P extends FilterProps<T>>(
        fieldPath: P
        , directionStr?: Firestore.OrderByDirection) => QueryConstraint<T>;

    //@ts-ignore
    const query: <T>(query: Firestore.Query<T>, ...queryConstraints: QueryConstraint<NoInfer<T>>[]) => Firestore.Query<T>;
}

type Split<T extends string, S extends string> =
    T extends `${infer L}${S}${infer R}`
    ? [L, ...Split<R, S>]
    : [T]
    ;

type Pop<T extends unknown[]> = T extends [...infer L, infer R] ? L : [];

type Shift<T extends unknown[]> = T extends [infer L, ...infer R] ? R : [];

type PatternArray<P extends unknown[], T extends unknown[], AllowEmpty extends 0 | 1 = 0> =
    T['length'] extends 0
    ? (AllowEmpty extends 1 ? T : never)
    : T extends [...P, ...infer R] ? PatternArray<P, R, 1> extends never ? never
    : T : never;


type PatternArrayNoAny<P extends unknown[], T extends unknown[], AllowEmpty extends 0 | 1 = 0> = HasAny<T> extends true ? never : PatternArray<P, T, AllowEmpty>;

type HasAny<T extends unknown[]> = T['length'] extends 0 ? false :
    (any extends T[0] ? true : false) extends true
    ? true
    : HasAny<Shift<T>>;

type Append<W, T extends unknown[]> = [...T, W];

type Concat<W extends unknown[], T extends unknown[]> = [...W, ...T];

type Prepend<W, T extends unknown[]> = [W, ...T];

type StrConcat<T extends string[] | string, S extends string> =
    T extends [infer I, ...infer Rest] ?
    //@ts-ignore
    `${I}${StrConcat<Rest, S> extends infer P ? P extends "" ? P : `${S}${P}` : P}` :
    ""
    ;

//@ts-ignore
type FirestoreKeys = unknown extends FirestorePaths ? string : keyof FirestorePaths;

type UnresolvedDocument = Firestore.DocumentData;

type FirestoreType<P> = string extends P ? UnresolvedDocument :
    //@ts-ignore
    P extends FirestoreKeys ? FirestorePaths[P] : UnresolvedDocument;

type NoInfer<T> = T extends infer S ? S : never;


type DeepKeysNoArrays<T> =
    object extends T ? string :
    T extends readonly unknown[] ? never :
    T extends object ? keyof T & string | DeepSubKeysNoArrays<T, keyof T & string> :
    never;

type DeepSubKeysNoArrays<T, K extends string> = K extends keyof T ? `${K}.${DeepKeysNoArrays<T[K]>}` : never;

type FilterProps<T> = DeepKeysNoArrays<T>;

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

type Decrement<N extends number> = ArrayRepeat<N> extends [_, ...infer U] ? U['length'] & number : never

type RangedTuple<T, Max, Min = 0> = Max extends Min
    ? ArrayRepeat<Max, T>
    : ArrayRepeat<Min, T> | RangedTuple<T, Max, Inc<Min>>
    ;

type ArrayRepeat<N, D = _, T extends D[] = []> = T['length'] extends N ? T : ArrayRepeat<N, D, [...T, D]>;

type Inc<N> = [...ArrayRepeat<N>, unknown]['length'] & number;

type UnNestType<T extends object, N extends string> = N extends `${infer P}.${infer R}`
    //@ts-ignore
    ? UnNestType<T[P] extends object ? T[P] : never, R> : T[N];

type Invalid<M> = Error & M;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _ = any;

type PathType<T extends string, M extends Mode = "collection", C = 0> =
    (C extends 100
        ? Invalid<"Maximum sub-collection depth is 100">
        : (T extends `${_}/${infer R}`
            ? PathType<R, Switch<M>, Inc<C>> : M)
    );

type Switch<T extends Mode> = T extends "collection" ? "document" : T extends "document" ? "collection" : never;

type Mode = "collection" | "document";

type CollectionPath<T extends string> = PathType<T> extends "collection" ? Path<T> : Invalid<"Path represents a document">;


type IfEqual<T, U, R = true, E = false> =
    Equals<T, U> extends true ? R : E;

type Path<T extends string, M extends Mode = 'collection'> =
    (T extends `${infer L}/${infer R}`
        ? (M extends "collection" ? `${L}${Path<R, Switch<M>>}` : `/${Path<R, Switch<M>>}`)
        : (M extends "document" ? "" : T))
    ;


//@ts-ignore
type TypeFromPath<T extends string> = T extends keyof FirestorePaths ? FirestorePaths[T] : never;

type CollectionTypeFromSegments<S extends string[]> = TypeFromSegments<S, "collection">;

type DocumentTypeFromSegments<S extends string[]> = TypeFromSegments<S, "document">;

type TypeFromSegments<S extends string[], M extends "collection" | "document"> = StrConcat<S, "/"> extends infer P
    ? (P extends string
        ?
        (Or<StrContains<P, string>, StrContains<P, `${any}`>> extends false
            ? ((PathType<P> extends M
                ? IfEqual<TypeFromPath<Path<P>>, never, Invalid<`'${P}' is not a valid path`>, TypeFromPath<Path<P>>>
                : Invalid<`Path '${P}' refers to ${Switch<M>}. Expecting a path for a ${M}`>))
            : Invalid<`'${P}' is not a valid path`>)
        : never
    )
    : never
    ;

type And<L, R> = L extends true ? R extends true ? true : false : false;

type Or<L, R> = L extends true ? true : R extends true ? true : false;

type StrContains<T, P> = T extends `${infer A}${infer R}`
    ? IfEqual<A, P, true, StrContains<R, P>>
    : IfEqual<T, P>
    ;

type Equals<T, U> =
    (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2)
    ? true
    : false
    ;
