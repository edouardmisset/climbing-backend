
/**
 * Client
**/

import * as runtime from '.././runtime/library.d.ts';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ascents
 * 
 */
export type ascents = $Result.DefaultSelection<Prisma.$ascentsPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Ascents
 * const ascents = await prisma.ascents.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Ascents
   * const ascents = await prisma.ascents.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.ascents`: Exposes CRUD operations for the **ascents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ascents
    * const ascents = await prisma.ascents.findMany()
    * ```
    */
  get ascents(): Prisma.ascentsDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.19.1
   * Query Engine version: 69d742ee20b815d88e17e54db4a2a7a3b30324e3
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ascents: 'ascents'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "ascents"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ascents: {
        payload: Prisma.$ascentsPayload<ExtArgs>
        fields: Prisma.ascentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ascentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ascentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>
          }
          findFirst: {
            args: Prisma.ascentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ascentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>
          }
          findMany: {
            args: Prisma.ascentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>[]
          }
          create: {
            args: Prisma.ascentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>
          }
          createMany: {
            args: Prisma.ascentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ascentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>[]
          }
          delete: {
            args: Prisma.ascentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>
          }
          update: {
            args: Prisma.ascentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>
          }
          deleteMany: {
            args: Prisma.ascentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ascentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ascentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ascentsPayload>
          }
          aggregate: {
            args: Prisma.AscentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAscents>
          }
          groupBy: {
            args: Prisma.ascentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AscentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ascentsCountArgs<ExtArgs>
            result: $Utils.Optional<AscentsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ascents
   */

  export type AggregateAscents = {
    _count: AscentsCountAggregateOutputType | null
    _avg: AscentsAvgAggregateOutputType | null
    _sum: AscentsSumAggregateOutputType | null
    _min: AscentsMinAggregateOutputType | null
    _max: AscentsMaxAggregateOutputType | null
  }

  export type AscentsAvgAggregateOutputType = {
    id: number | null
    tries: number | null
    height: number | null
    rating: number | null
  }

  export type AscentsSumAggregateOutputType = {
    id: number | null
    tries: number | null
    height: number | null
    rating: number | null
  }

  export type AscentsMinAggregateOutputType = {
    id: number | null
    routeName: string | null
    topoGrade: string | null
    date: Date | null
    tries: number | null
    myGrade: string | null
    height: number | null
    holds: string | null
    profile: string | null
    rating: number | null
    routeOrBoulder: string | null
    crag: string | null
    area: string | null
    departement: string | null
    climber: string | null
    comments: string | null
  }

  export type AscentsMaxAggregateOutputType = {
    id: number | null
    routeName: string | null
    topoGrade: string | null
    date: Date | null
    tries: number | null
    myGrade: string | null
    height: number | null
    holds: string | null
    profile: string | null
    rating: number | null
    routeOrBoulder: string | null
    crag: string | null
    area: string | null
    departement: string | null
    climber: string | null
    comments: string | null
  }

  export type AscentsCountAggregateOutputType = {
    id: number
    routeName: number
    topoGrade: number
    date: number
    tries: number
    myGrade: number
    height: number
    holds: number
    profile: number
    rating: number
    routeOrBoulder: number
    crag: number
    area: number
    departement: number
    climber: number
    comments: number
    _all: number
  }


  export type AscentsAvgAggregateInputType = {
    id?: true
    tries?: true
    height?: true
    rating?: true
  }

  export type AscentsSumAggregateInputType = {
    id?: true
    tries?: true
    height?: true
    rating?: true
  }

  export type AscentsMinAggregateInputType = {
    id?: true
    routeName?: true
    topoGrade?: true
    date?: true
    tries?: true
    myGrade?: true
    height?: true
    holds?: true
    profile?: true
    rating?: true
    routeOrBoulder?: true
    crag?: true
    area?: true
    departement?: true
    climber?: true
    comments?: true
  }

  export type AscentsMaxAggregateInputType = {
    id?: true
    routeName?: true
    topoGrade?: true
    date?: true
    tries?: true
    myGrade?: true
    height?: true
    holds?: true
    profile?: true
    rating?: true
    routeOrBoulder?: true
    crag?: true
    area?: true
    departement?: true
    climber?: true
    comments?: true
  }

  export type AscentsCountAggregateInputType = {
    id?: true
    routeName?: true
    topoGrade?: true
    date?: true
    tries?: true
    myGrade?: true
    height?: true
    holds?: true
    profile?: true
    rating?: true
    routeOrBoulder?: true
    crag?: true
    area?: true
    departement?: true
    climber?: true
    comments?: true
    _all?: true
  }

  export type AscentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ascents to aggregate.
     */
    where?: ascentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ascents to fetch.
     */
    orderBy?: ascentsOrderByWithRelationInput | ascentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ascentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ascents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ascents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ascents
    **/
    _count?: true | AscentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AscentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AscentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AscentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AscentsMaxAggregateInputType
  }

  export type GetAscentsAggregateType<T extends AscentsAggregateArgs> = {
        [P in keyof T & keyof AggregateAscents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAscents[P]>
      : GetScalarType<T[P], AggregateAscents[P]>
  }




  export type ascentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ascentsWhereInput
    orderBy?: ascentsOrderByWithAggregationInput | ascentsOrderByWithAggregationInput[]
    by: AscentsScalarFieldEnum[] | AscentsScalarFieldEnum
    having?: ascentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AscentsCountAggregateInputType | true
    _avg?: AscentsAvgAggregateInputType
    _sum?: AscentsSumAggregateInputType
    _min?: AscentsMinAggregateInputType
    _max?: AscentsMaxAggregateInputType
  }

  export type AscentsGroupByOutputType = {
    id: number
    routeName: string
    topoGrade: string
    date: Date
    tries: number
    myGrade: string
    height: number
    holds: string
    profile: string
    rating: number
    routeOrBoulder: string
    crag: string
    area: string
    departement: string
    climber: string
    comments: string
    _count: AscentsCountAggregateOutputType | null
    _avg: AscentsAvgAggregateOutputType | null
    _sum: AscentsSumAggregateOutputType | null
    _min: AscentsMinAggregateOutputType | null
    _max: AscentsMaxAggregateOutputType | null
  }

  type GetAscentsGroupByPayload<T extends ascentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AscentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AscentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AscentsGroupByOutputType[P]>
            : GetScalarType<T[P], AscentsGroupByOutputType[P]>
        }
      >
    >


  export type ascentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    routeName?: boolean
    topoGrade?: boolean
    date?: boolean
    tries?: boolean
    myGrade?: boolean
    height?: boolean
    holds?: boolean
    profile?: boolean
    rating?: boolean
    routeOrBoulder?: boolean
    crag?: boolean
    area?: boolean
    departement?: boolean
    climber?: boolean
    comments?: boolean
  }, ExtArgs["result"]["ascents"]>

  export type ascentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    routeName?: boolean
    topoGrade?: boolean
    date?: boolean
    tries?: boolean
    myGrade?: boolean
    height?: boolean
    holds?: boolean
    profile?: boolean
    rating?: boolean
    routeOrBoulder?: boolean
    crag?: boolean
    area?: boolean
    departement?: boolean
    climber?: boolean
    comments?: boolean
  }, ExtArgs["result"]["ascents"]>

  export type ascentsSelectScalar = {
    id?: boolean
    routeName?: boolean
    topoGrade?: boolean
    date?: boolean
    tries?: boolean
    myGrade?: boolean
    height?: boolean
    holds?: boolean
    profile?: boolean
    rating?: boolean
    routeOrBoulder?: boolean
    crag?: boolean
    area?: boolean
    departement?: boolean
    climber?: boolean
    comments?: boolean
  }


  export type $ascentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ascents"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      routeName: string
      topoGrade: string
      date: Date
      tries: number
      myGrade: string
      height: number
      holds: string
      profile: string
      rating: number
      routeOrBoulder: string
      crag: string
      area: string
      departement: string
      climber: string
      comments: string
    }, ExtArgs["result"]["ascents"]>
    composites: {}
  }

  type ascentsGetPayload<S extends boolean | null | undefined | ascentsDefaultArgs> = $Result.GetResult<Prisma.$ascentsPayload, S>

  type ascentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ascentsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AscentsCountAggregateInputType | true
    }

  export interface ascentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ascents'], meta: { name: 'ascents' } }
    /**
     * Find zero or one Ascents that matches the filter.
     * @param {ascentsFindUniqueArgs} args - Arguments to find a Ascents
     * @example
     * // Get one Ascents
     * const ascents = await prisma.ascents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ascentsFindUniqueArgs>(args: SelectSubset<T, ascentsFindUniqueArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Ascents that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ascentsFindUniqueOrThrowArgs} args - Arguments to find a Ascents
     * @example
     * // Get one Ascents
     * const ascents = await prisma.ascents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ascentsFindUniqueOrThrowArgs>(args: SelectSubset<T, ascentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Ascents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ascentsFindFirstArgs} args - Arguments to find a Ascents
     * @example
     * // Get one Ascents
     * const ascents = await prisma.ascents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ascentsFindFirstArgs>(args?: SelectSubset<T, ascentsFindFirstArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Ascents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ascentsFindFirstOrThrowArgs} args - Arguments to find a Ascents
     * @example
     * // Get one Ascents
     * const ascents = await prisma.ascents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ascentsFindFirstOrThrowArgs>(args?: SelectSubset<T, ascentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ascents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ascentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ascents
     * const ascents = await prisma.ascents.findMany()
     * 
     * // Get first 10 Ascents
     * const ascents = await prisma.ascents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ascentsWithIdOnly = await prisma.ascents.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ascentsFindManyArgs>(args?: SelectSubset<T, ascentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Ascents.
     * @param {ascentsCreateArgs} args - Arguments to create a Ascents.
     * @example
     * // Create one Ascents
     * const Ascents = await prisma.ascents.create({
     *   data: {
     *     // ... data to create a Ascents
     *   }
     * })
     * 
     */
    create<T extends ascentsCreateArgs>(args: SelectSubset<T, ascentsCreateArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ascents.
     * @param {ascentsCreateManyArgs} args - Arguments to create many Ascents.
     * @example
     * // Create many Ascents
     * const ascents = await prisma.ascents.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ascentsCreateManyArgs>(args?: SelectSubset<T, ascentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ascents and returns the data saved in the database.
     * @param {ascentsCreateManyAndReturnArgs} args - Arguments to create many Ascents.
     * @example
     * // Create many Ascents
     * const ascents = await prisma.ascents.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ascents and only return the `id`
     * const ascentsWithIdOnly = await prisma.ascents.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ascentsCreateManyAndReturnArgs>(args?: SelectSubset<T, ascentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Ascents.
     * @param {ascentsDeleteArgs} args - Arguments to delete one Ascents.
     * @example
     * // Delete one Ascents
     * const Ascents = await prisma.ascents.delete({
     *   where: {
     *     // ... filter to delete one Ascents
     *   }
     * })
     * 
     */
    delete<T extends ascentsDeleteArgs>(args: SelectSubset<T, ascentsDeleteArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Ascents.
     * @param {ascentsUpdateArgs} args - Arguments to update one Ascents.
     * @example
     * // Update one Ascents
     * const ascents = await prisma.ascents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ascentsUpdateArgs>(args: SelectSubset<T, ascentsUpdateArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ascents.
     * @param {ascentsDeleteManyArgs} args - Arguments to filter Ascents to delete.
     * @example
     * // Delete a few Ascents
     * const { count } = await prisma.ascents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ascentsDeleteManyArgs>(args?: SelectSubset<T, ascentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ascents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ascentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ascents
     * const ascents = await prisma.ascents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ascentsUpdateManyArgs>(args: SelectSubset<T, ascentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ascents.
     * @param {ascentsUpsertArgs} args - Arguments to update or create a Ascents.
     * @example
     * // Update or create a Ascents
     * const ascents = await prisma.ascents.upsert({
     *   create: {
     *     // ... data to create a Ascents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ascents we want to update
     *   }
     * })
     */
    upsert<T extends ascentsUpsertArgs>(args: SelectSubset<T, ascentsUpsertArgs<ExtArgs>>): Prisma__ascentsClient<$Result.GetResult<Prisma.$ascentsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ascents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ascentsCountArgs} args - Arguments to filter Ascents to count.
     * @example
     * // Count the number of Ascents
     * const count = await prisma.ascents.count({
     *   where: {
     *     // ... the filter for the Ascents we want to count
     *   }
     * })
    **/
    count<T extends ascentsCountArgs>(
      args?: Subset<T, ascentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AscentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ascents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AscentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AscentsAggregateArgs>(args: Subset<T, AscentsAggregateArgs>): Prisma.PrismaPromise<GetAscentsAggregateType<T>>

    /**
     * Group by Ascents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ascentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ascentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ascentsGroupByArgs['orderBy'] }
        : { orderBy?: ascentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ascentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAscentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ascents model
   */
  readonly fields: ascentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ascents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ascentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ascents model
   */ 
  interface ascentsFieldRefs {
    readonly id: FieldRef<"ascents", 'Int'>
    readonly routeName: FieldRef<"ascents", 'String'>
    readonly topoGrade: FieldRef<"ascents", 'String'>
    readonly date: FieldRef<"ascents", 'DateTime'>
    readonly tries: FieldRef<"ascents", 'Int'>
    readonly myGrade: FieldRef<"ascents", 'String'>
    readonly height: FieldRef<"ascents", 'Int'>
    readonly holds: FieldRef<"ascents", 'String'>
    readonly profile: FieldRef<"ascents", 'String'>
    readonly rating: FieldRef<"ascents", 'Int'>
    readonly routeOrBoulder: FieldRef<"ascents", 'String'>
    readonly crag: FieldRef<"ascents", 'String'>
    readonly area: FieldRef<"ascents", 'String'>
    readonly departement: FieldRef<"ascents", 'String'>
    readonly climber: FieldRef<"ascents", 'String'>
    readonly comments: FieldRef<"ascents", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ascents findUnique
   */
  export type ascentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * Filter, which ascents to fetch.
     */
    where: ascentsWhereUniqueInput
  }

  /**
   * ascents findUniqueOrThrow
   */
  export type ascentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * Filter, which ascents to fetch.
     */
    where: ascentsWhereUniqueInput
  }

  /**
   * ascents findFirst
   */
  export type ascentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * Filter, which ascents to fetch.
     */
    where?: ascentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ascents to fetch.
     */
    orderBy?: ascentsOrderByWithRelationInput | ascentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ascents.
     */
    cursor?: ascentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ascents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ascents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ascents.
     */
    distinct?: AscentsScalarFieldEnum | AscentsScalarFieldEnum[]
  }

  /**
   * ascents findFirstOrThrow
   */
  export type ascentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * Filter, which ascents to fetch.
     */
    where?: ascentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ascents to fetch.
     */
    orderBy?: ascentsOrderByWithRelationInput | ascentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ascents.
     */
    cursor?: ascentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ascents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ascents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ascents.
     */
    distinct?: AscentsScalarFieldEnum | AscentsScalarFieldEnum[]
  }

  /**
   * ascents findMany
   */
  export type ascentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * Filter, which ascents to fetch.
     */
    where?: ascentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ascents to fetch.
     */
    orderBy?: ascentsOrderByWithRelationInput | ascentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ascents.
     */
    cursor?: ascentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ascents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ascents.
     */
    skip?: number
    distinct?: AscentsScalarFieldEnum | AscentsScalarFieldEnum[]
  }

  /**
   * ascents create
   */
  export type ascentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * The data needed to create a ascents.
     */
    data: XOR<ascentsCreateInput, ascentsUncheckedCreateInput>
  }

  /**
   * ascents createMany
   */
  export type ascentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ascents.
     */
    data: ascentsCreateManyInput | ascentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ascents createManyAndReturn
   */
  export type ascentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ascents.
     */
    data: ascentsCreateManyInput | ascentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ascents update
   */
  export type ascentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * The data needed to update a ascents.
     */
    data: XOR<ascentsUpdateInput, ascentsUncheckedUpdateInput>
    /**
     * Choose, which ascents to update.
     */
    where: ascentsWhereUniqueInput
  }

  /**
   * ascents updateMany
   */
  export type ascentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ascents.
     */
    data: XOR<ascentsUpdateManyMutationInput, ascentsUncheckedUpdateManyInput>
    /**
     * Filter which ascents to update
     */
    where?: ascentsWhereInput
  }

  /**
   * ascents upsert
   */
  export type ascentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * The filter to search for the ascents to update in case it exists.
     */
    where: ascentsWhereUniqueInput
    /**
     * In case the ascents found by the `where` argument doesn't exist, create a new ascents with this data.
     */
    create: XOR<ascentsCreateInput, ascentsUncheckedCreateInput>
    /**
     * In case the ascents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ascentsUpdateInput, ascentsUncheckedUpdateInput>
  }

  /**
   * ascents delete
   */
  export type ascentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
    /**
     * Filter which ascents to delete.
     */
    where: ascentsWhereUniqueInput
  }

  /**
   * ascents deleteMany
   */
  export type ascentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ascents to delete
     */
    where?: ascentsWhereInput
  }

  /**
   * ascents without action
   */
  export type ascentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ascents
     */
    select?: ascentsSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AscentsScalarFieldEnum: {
    id: 'id',
    routeName: 'routeName',
    topoGrade: 'topoGrade',
    date: 'date',
    tries: 'tries',
    myGrade: 'myGrade',
    height: 'height',
    holds: 'holds',
    profile: 'profile',
    rating: 'rating',
    routeOrBoulder: 'routeOrBoulder',
    crag: 'crag',
    area: 'area',
    departement: 'departement',
    climber: 'climber',
    comments: 'comments'
  };

  export type AscentsScalarFieldEnum = (typeof AscentsScalarFieldEnum)[keyof typeof AscentsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ascentsWhereInput = {
    AND?: ascentsWhereInput | ascentsWhereInput[]
    OR?: ascentsWhereInput[]
    NOT?: ascentsWhereInput | ascentsWhereInput[]
    id?: IntFilter<"ascents"> | number
    routeName?: StringFilter<"ascents"> | string
    topoGrade?: StringFilter<"ascents"> | string
    date?: DateTimeFilter<"ascents"> | Date | string
    tries?: IntFilter<"ascents"> | number
    myGrade?: StringFilter<"ascents"> | string
    height?: IntFilter<"ascents"> | number
    holds?: StringFilter<"ascents"> | string
    profile?: StringFilter<"ascents"> | string
    rating?: IntFilter<"ascents"> | number
    routeOrBoulder?: StringFilter<"ascents"> | string
    crag?: StringFilter<"ascents"> | string
    area?: StringFilter<"ascents"> | string
    departement?: StringFilter<"ascents"> | string
    climber?: StringFilter<"ascents"> | string
    comments?: StringFilter<"ascents"> | string
  }

  export type ascentsOrderByWithRelationInput = {
    id?: SortOrder
    routeName?: SortOrder
    topoGrade?: SortOrder
    date?: SortOrder
    tries?: SortOrder
    myGrade?: SortOrder
    height?: SortOrder
    holds?: SortOrder
    profile?: SortOrder
    rating?: SortOrder
    routeOrBoulder?: SortOrder
    crag?: SortOrder
    area?: SortOrder
    departement?: SortOrder
    climber?: SortOrder
    comments?: SortOrder
  }

  export type ascentsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ascentsWhereInput | ascentsWhereInput[]
    OR?: ascentsWhereInput[]
    NOT?: ascentsWhereInput | ascentsWhereInput[]
    routeName?: StringFilter<"ascents"> | string
    topoGrade?: StringFilter<"ascents"> | string
    date?: DateTimeFilter<"ascents"> | Date | string
    tries?: IntFilter<"ascents"> | number
    myGrade?: StringFilter<"ascents"> | string
    height?: IntFilter<"ascents"> | number
    holds?: StringFilter<"ascents"> | string
    profile?: StringFilter<"ascents"> | string
    rating?: IntFilter<"ascents"> | number
    routeOrBoulder?: StringFilter<"ascents"> | string
    crag?: StringFilter<"ascents"> | string
    area?: StringFilter<"ascents"> | string
    departement?: StringFilter<"ascents"> | string
    climber?: StringFilter<"ascents"> | string
    comments?: StringFilter<"ascents"> | string
  }, "id">

  export type ascentsOrderByWithAggregationInput = {
    id?: SortOrder
    routeName?: SortOrder
    topoGrade?: SortOrder
    date?: SortOrder
    tries?: SortOrder
    myGrade?: SortOrder
    height?: SortOrder
    holds?: SortOrder
    profile?: SortOrder
    rating?: SortOrder
    routeOrBoulder?: SortOrder
    crag?: SortOrder
    area?: SortOrder
    departement?: SortOrder
    climber?: SortOrder
    comments?: SortOrder
    _count?: ascentsCountOrderByAggregateInput
    _avg?: ascentsAvgOrderByAggregateInput
    _max?: ascentsMaxOrderByAggregateInput
    _min?: ascentsMinOrderByAggregateInput
    _sum?: ascentsSumOrderByAggregateInput
  }

  export type ascentsScalarWhereWithAggregatesInput = {
    AND?: ascentsScalarWhereWithAggregatesInput | ascentsScalarWhereWithAggregatesInput[]
    OR?: ascentsScalarWhereWithAggregatesInput[]
    NOT?: ascentsScalarWhereWithAggregatesInput | ascentsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ascents"> | number
    routeName?: StringWithAggregatesFilter<"ascents"> | string
    topoGrade?: StringWithAggregatesFilter<"ascents"> | string
    date?: DateTimeWithAggregatesFilter<"ascents"> | Date | string
    tries?: IntWithAggregatesFilter<"ascents"> | number
    myGrade?: StringWithAggregatesFilter<"ascents"> | string
    height?: IntWithAggregatesFilter<"ascents"> | number
    holds?: StringWithAggregatesFilter<"ascents"> | string
    profile?: StringWithAggregatesFilter<"ascents"> | string
    rating?: IntWithAggregatesFilter<"ascents"> | number
    routeOrBoulder?: StringWithAggregatesFilter<"ascents"> | string
    crag?: StringWithAggregatesFilter<"ascents"> | string
    area?: StringWithAggregatesFilter<"ascents"> | string
    departement?: StringWithAggregatesFilter<"ascents"> | string
    climber?: StringWithAggregatesFilter<"ascents"> | string
    comments?: StringWithAggregatesFilter<"ascents"> | string
  }

  export type ascentsCreateInput = {
    routeName: string
    topoGrade: string
    date?: Date | string
    tries: number
    myGrade: string
    height: number
    holds: string
    profile: string
    rating: number
    routeOrBoulder: string
    crag: string
    area: string
    departement: string
    climber: string
    comments: string
  }

  export type ascentsUncheckedCreateInput = {
    id?: number
    routeName: string
    topoGrade: string
    date?: Date | string
    tries: number
    myGrade: string
    height: number
    holds: string
    profile: string
    rating: number
    routeOrBoulder: string
    crag: string
    area: string
    departement: string
    climber: string
    comments: string
  }

  export type ascentsUpdateInput = {
    routeName?: StringFieldUpdateOperationsInput | string
    topoGrade?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    tries?: IntFieldUpdateOperationsInput | number
    myGrade?: StringFieldUpdateOperationsInput | string
    height?: IntFieldUpdateOperationsInput | number
    holds?: StringFieldUpdateOperationsInput | string
    profile?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    routeOrBoulder?: StringFieldUpdateOperationsInput | string
    crag?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    departement?: StringFieldUpdateOperationsInput | string
    climber?: StringFieldUpdateOperationsInput | string
    comments?: StringFieldUpdateOperationsInput | string
  }

  export type ascentsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    routeName?: StringFieldUpdateOperationsInput | string
    topoGrade?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    tries?: IntFieldUpdateOperationsInput | number
    myGrade?: StringFieldUpdateOperationsInput | string
    height?: IntFieldUpdateOperationsInput | number
    holds?: StringFieldUpdateOperationsInput | string
    profile?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    routeOrBoulder?: StringFieldUpdateOperationsInput | string
    crag?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    departement?: StringFieldUpdateOperationsInput | string
    climber?: StringFieldUpdateOperationsInput | string
    comments?: StringFieldUpdateOperationsInput | string
  }

  export type ascentsCreateManyInput = {
    id?: number
    routeName: string
    topoGrade: string
    date?: Date | string
    tries: number
    myGrade: string
    height: number
    holds: string
    profile: string
    rating: number
    routeOrBoulder: string
    crag: string
    area: string
    departement: string
    climber: string
    comments: string
  }

  export type ascentsUpdateManyMutationInput = {
    routeName?: StringFieldUpdateOperationsInput | string
    topoGrade?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    tries?: IntFieldUpdateOperationsInput | number
    myGrade?: StringFieldUpdateOperationsInput | string
    height?: IntFieldUpdateOperationsInput | number
    holds?: StringFieldUpdateOperationsInput | string
    profile?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    routeOrBoulder?: StringFieldUpdateOperationsInput | string
    crag?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    departement?: StringFieldUpdateOperationsInput | string
    climber?: StringFieldUpdateOperationsInput | string
    comments?: StringFieldUpdateOperationsInput | string
  }

  export type ascentsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    routeName?: StringFieldUpdateOperationsInput | string
    topoGrade?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    tries?: IntFieldUpdateOperationsInput | number
    myGrade?: StringFieldUpdateOperationsInput | string
    height?: IntFieldUpdateOperationsInput | number
    holds?: StringFieldUpdateOperationsInput | string
    profile?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    routeOrBoulder?: StringFieldUpdateOperationsInput | string
    crag?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    departement?: StringFieldUpdateOperationsInput | string
    climber?: StringFieldUpdateOperationsInput | string
    comments?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ascentsCountOrderByAggregateInput = {
    id?: SortOrder
    routeName?: SortOrder
    topoGrade?: SortOrder
    date?: SortOrder
    tries?: SortOrder
    myGrade?: SortOrder
    height?: SortOrder
    holds?: SortOrder
    profile?: SortOrder
    rating?: SortOrder
    routeOrBoulder?: SortOrder
    crag?: SortOrder
    area?: SortOrder
    departement?: SortOrder
    climber?: SortOrder
    comments?: SortOrder
  }

  export type ascentsAvgOrderByAggregateInput = {
    id?: SortOrder
    tries?: SortOrder
    height?: SortOrder
    rating?: SortOrder
  }

  export type ascentsMaxOrderByAggregateInput = {
    id?: SortOrder
    routeName?: SortOrder
    topoGrade?: SortOrder
    date?: SortOrder
    tries?: SortOrder
    myGrade?: SortOrder
    height?: SortOrder
    holds?: SortOrder
    profile?: SortOrder
    rating?: SortOrder
    routeOrBoulder?: SortOrder
    crag?: SortOrder
    area?: SortOrder
    departement?: SortOrder
    climber?: SortOrder
    comments?: SortOrder
  }

  export type ascentsMinOrderByAggregateInput = {
    id?: SortOrder
    routeName?: SortOrder
    topoGrade?: SortOrder
    date?: SortOrder
    tries?: SortOrder
    myGrade?: SortOrder
    height?: SortOrder
    holds?: SortOrder
    profile?: SortOrder
    rating?: SortOrder
    routeOrBoulder?: SortOrder
    crag?: SortOrder
    area?: SortOrder
    departement?: SortOrder
    climber?: SortOrder
    comments?: SortOrder
  }

  export type ascentsSumOrderByAggregateInput = {
    id?: SortOrder
    tries?: SortOrder
    height?: SortOrder
    rating?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ascentsDefaultArgs instead
     */
    export type ascentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ascentsDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}