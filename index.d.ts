
import * as Firestore from "@firebase/firestore";


interface QueryConstraint<T> extends Firestore.QueryConstraint {
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

    type Mapped<PS extends string[], M extends PathType> =
        TypeFromSegments2<PS> extends infer R
        ? R extends Error ? R
        : M extends "collection" ? MappedCollectionReference<R, StrConcat<ContractPath<PS>, "/">>
        : MappedDocumentReference<R, StrConcat<ContractPath<PS>, "/">>
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
            T = AnyDocument
        >
        (
            firestore: Firestore.Firestore
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.CollectionReference<T>;

    function typedCollection
        <
            T = AnyDocument
        >
        (
            reference: Firestore.CollectionReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.CollectionReference<T>;

    function typedCollection
        <
            T = AnyDocument
        >
        (
            reference: Firestore.DocumentReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.CollectionReference<T>

    function typedDocument
        <
            T = AnyDocument
        >
        (
            firestore: Firestore.Firestore
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.DocumentReference<T>;

    function typedDocument
        <
            T = AnyDocument
        >
        (
            reference: Firestore.DocumentReference<unknown>
            , path: string
            , ...pathSegments: string[]
        )
        : Firestore.DocumentReference<T>;

    function typedDocument
        <
            T = AnyDocument
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
        >(
            firestore: Firestore.Firestore
            , path: P
            , ...pathSegments: A
        )
        : Mapped<PreparePath<[P, ...A]>, "collection">;


    function strictCollection
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends MergeSegments<P1, "collection", [P2, ...A], "collection">
        >
        (
            reference: MappedCollectionReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        //@ts-ignore
        : Mapped<PS, "collection">;


    function strictCollection
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends MergeSegments<P1, "document", [P2, ...A], "collection">
        >
        (
            reference: MappedDocumentReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )

        //@ts-ignore
        : Mapped<PS, "collection">;



    function strictDocument
        <
            P extends string
            , A extends string[]
        >(
            firestore: Firestore.Firestore
            , path: P
            , ...pathSegments: A
        )
        : Mapped<PreparePath<[P, ...A]>, "document">;

    function strictDocument
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends MergeSegments<P1, "collection", [P2, ...A], "document">
        >
        (
            reference: MappedCollectionReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        //@ts-ignore
        : Mapped<PS, "document">

    function strictDocument
        <
            O
            , P1 extends string
            , P2 extends string
            , A extends string[]
            , PS extends MergeSegments<P1, "document", [P2, ...A], "document">
        >
        (
            reference: MappedDocumentReference<O, P1>
            , path: P2
            , ...pathSegments: A
        )
        //@ts-ignore
        : Mapped<PS, "document">

    //@ts-ignore
    type Collection = Equals<FirestoreConfig, any> extends false ? typeof strictCollection : typeof typedCollection;

    //@ts-ignore
    type Doc = Equals<FirestoreConfig, any> extends false ? typeof strictDocument : typeof typedDocument;

    //@ts-ignore
    const doc: Doc;

    //@ts-ignore
    const collection: Collection;

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
type MergeSegments<P1 extends string, M1 extends PathType, P2 extends string[], M2 extends PathType> =
    SegmentsFromParts<[...ExpandPath<Split<P1, "/">, M1>, ...P2], M2>;

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

type PathType = "collection" | "document";

type StrConcat<T extends unknown[] | unknown, S extends string> =
    T extends [infer I, ...infer Rest] ?
    //@ts-ignore
    `${I}${StrConcat<Rest, S> extends infer P ? P extends "" ? P : `${S}${P}` : P}` :
    ""
    ;

//@ts-ignore
type FirestoreKeys = keyof FirestoreConfig;

type AnyDocument = Firestore.DocumentData;

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

type TypeOfPath<T extends string, M extends PathType = "collection", C = 0> =
    (C extends 100
        ? Invalid<"Maximum sub-collection depth is 100">
        : (T extends `${_}/${infer R}`
            ? TypeOfPath<R, Switch<M>, Inc<C>> : M)
    );

type Switch<T extends PathType> = T extends "collection" ? "document" : T extends "document" ? "collection" : never;


type IfEqual<T, U, R = true, E = false> =
    Equals<T, U> extends true ? R : E;

type Path<T extends string, M extends PathType = 'collection'> =
    (T extends `${infer L}/${infer R}`
        ? (M extends "collection" ? `${L}${Path<R, Switch<M>> extends infer R ? R extends "" ? R : `/${R & string}` : never}` : `${Path<R, Switch<M>>}`)
        : (M extends "document" ? "" : T))
    ;


//@ts-ignore
type TypeFromPath<T extends string> = T extends FirestoreKeys ? FirestoreConfig[T] : never;

type NoIncorrectLength<S extends string[], M extends PathType> =
    Even<S['length']> extends true
    ? (
        M extends "collection"
        ? Invalid<`Collection must have an odd number of segments. ${S['length']}`>
        : S
    )
    : (
        M extends "document"
        ? Invalid<`Document must have an even number of segments. ${S['length']}`>
        : S
    )

    ;
type NoDoubleSlash<S extends string[], N extends number = 0> = N extends S['length'] ? S :
    S[N] extends (`${any}//${any}` | `//${any}` | `${any}//`) ? Invalid<`Segment at index ${N} contains invalid '//'`> : NoDoubleSlash<S, Inc<N>>;

type NoInvalidPlaceholders<S extends string[], N extends number = 0> =
    N extends S['length'] ? S :
    HasInvalidPlaceholder<S[N]> extends true
    ? Invalid<`Segment at index ${N} has an invalid placeholder (string | any | unknown)`>
    : NoInvalidPlaceholders<S, Inc<N>>
    ;
type NoMoreThan100Parts<S extends string[], N extends number = 0> =
    N extends 100 ? Invalid<`Contains more than 100 segments`>
    : (
        S['length'] extends N
        ? S
        : NoMoreThan100Parts<S, Inc<N>>
    );


type HasInvalidPlaceholder<S extends string> =
    S extends `${infer P}${infer R}`
    ? (
        Or<Equals<P, `${string}`>
            , Or<Equals<P, `${any}`>
                //@ts-ignore
                , Equals<P, `${unknown}`>>> extends true
        ? true
        : HasInvalidPlaceholder<R>
    )
    : Or<Equals<S, `${string}`>
        , Or<Equals<S, `${any}`>
            //@ts-ignore
            , Equals<S, `${unknown}`>>>;
type SegmentsFromParts<S extends string[], M extends PathType> =
    NoDoubleSlash<S> extends infer MaybeError ? MaybeError extends Error ? MaybeError
    : NoInvalidPlaceholders<S> extends infer MaybeError ? MaybeError extends Error ? MaybeError
    : PreparePath<S> extends infer Segments
    // ? Segments 
    //@ts-ignore
    ? NoMoreThan100Parts<Segments> extends infer MaybeError ? MaybeError extends Error ? MaybeError
    //@ts-ignore
    : NoIncorrectLength<Segments, M>
    : never
    : never
    : never
    : never
    // : never
    ;

type T0 = SegmentsFromParts<["cities", "NY" | "LA"], "document">;
declare global {
    type FirestoreConfig = {
        "cities": number
    }
}

type TypeFromSegments2<S extends unknown[]> =
    StrConcat<ContractPath<S>, "/"> extends infer K
    ? K extends FirestoreKeys
    //@ts-ignore
    ? FirestoreConfig[K]
    : Invalid<`Can not find '${K & string}' in the provided paths`>
    : never
    ;

type And<L, R> = L extends true ? R extends true ? true : false : false;

type Or<L, R> = L extends true ? true : R extends true ? true : false;

type Equals<T, U> =
    (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2)
    ? true
    : false
    ;

type Even<T extends number> = `${T}` extends `${string}${0 | 2 | 4 | 6 | 8}` ? true : false;

type Odd<T extends number> = `${T}` extends `${string}${1 | 3 | 5 | 7 | 9}` ? true : false;

type DocMark = `📄`;

type PreparePath<S extends unknown[]> = PartsToSegment<S> extends infer Segments ?
    //@ts-ignore
    [...
        {
            [K in keyof Segments]: K extends `${number}`
            ? (
                // @ts-ignore
                Odd<K> extends true
                ? DocMark
                : Segments[K]
            )
            : never;
        }] : never;

type ExpandPath<S extends unknown[], M extends "collection" | "document"> =
    S extends "" ? "" : S extends [infer O] ? M extends "document" ? [O, DocMark] : [O] : S extends [infer A, ...infer R] ?
    [A, DocMark, ...ExpandPath<R, M>] : S
    ;


type ContractPath<S extends unknown[]> = S extends [] ? [] : S extends [infer A, ...infer R] ?
    A extends DocMark ? ContractPath<R> : [A, ...ContractPath<R>] : S;




type PartsToSegment<S extends unknown[]> = S extends [] ? [] : S extends [infer A, ...infer R] ?
    //@ts-ignore
    [...Split<RemoveEdgeSlashes<A>, "/">, ...PartsToSegment<R>] : S;

type RemoveEdgeSlashes<S extends string> = S extends (`/${infer D}/` | `/${infer D}` | `${infer D}/`) ? RemoveEdgeSlashes<D> : S;
