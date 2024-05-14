if (!import.meta.env.VITE_API_KEY) throw new Error('VITE_API_KEY should be set inside .env')

export interface Participant {
    /** ID */
    id?: number;
    /**
     * External user id
     * Unique number of participant's on his T-shirt
     * @min -2147483648
     * @max 2147483647
     */
    external_user_id?: number | null;
    /**
     * First name
     * @maxLength 255
     */
    first_name?: string | null;
    /**
     * Last name
     * @maxLength 255
     */
    last_name?: string | null;
    /**
     * Age
     * @min 0
     * @max 32767
     */
    age?: number | null;
    /** Gender */
    gender?: "male" | "female" | null;
    /** Experimental group */
    experimental_group?: "with_support" | "without_support" | null;
    /**
     * Created at
     * @format date-time
     */
    created_at?: string;
    /**
     * Updated at
     * @format date-time
     */
    updated_at?: string;
}

export interface ParticipantMetrics {
    /** ID */
    id?: number;
    participant?: Participant;
    /** Heart rate */
    heart_rate?: number | null;
    /** Emotional involvement */
    emotional_involvement?: number | null;
    /** Degree of rest */
    degree_of_rest?: number | null;
    /** Concentration */
    concentration?: number | null;
    /** Stress */
    stress?: number | null;
    /** Mental fatigue level */
    mental_fatigue_level?: number | null;
    /** Sport anger */
    sport_anger?: number | null;
    /**
     * Distance
     * @max 4.25
     */
    distance: number;
    /**
     * Speed
     * @max 50.49
     */
    speed: number;
    /**
     * Created at
     * @format date-time
     */
    created_at?: string;
    /**
     * Updated at
     * @format date-time
     */
    updated_at?: string;
}

export interface GetParticipantMetricsOnPoint {
    /** ID */
    id?: number;
    participant?: Participant;
    /** Emotional involvement */
    emotional_involvement?: number | null;
    /** Degree of rest */
    degree_of_rest?: number | null;
    /** Concentration */
    concentration?: number | null;
    /** Mental fatigue level */
    mental_fatigue_level?: number | null;
    /** Sport anger */
    sport_anger?: number | null;
    /**
     * Created at
     * @format date-time
     */
    created_at?: string;
    /**
     * Updated at
     * @format date-time
     */
    updated_at?: string;
}

export interface GetParticipantMetricsRealtime {
    /** ID */
    id?: number;
    participant?: Participant;
    /** Heart rate */
    heart_rate?: number | null;
    /** Stress */
    stress?: number | null;
    /** Distance */
    distance?: number | null;
    /** Speed */
    speed?: number | null;
    /**
     * Created at
     * @format date-time
     */
    created_at?: string;
    /**
     * Updated at
     * @format date-time
     */
    updated_at?: string;
}

export interface ParticipantUpdateMetrics {
    /** ID */
    id?: number;
    /** Heart rate */
    heart_rate?: number | null;
    /** Emotional involvement */
    emotional_involvement?: number | null;
    /** Degree of rest */
    degree_of_rest?: number | null;
    /** Concentration */
    concentration?: number | null;
    /** Stress */
    stress?: number | null;
    /** Mental fatigue level */
    mental_fatigue_level?: number | null;
    /** Sport anger */
    sport_anger?: number | null;
    /** Distance */
    distance?: number | null;
    /** Speed */
    speed?: number | null;
    /**
     * Created at
     * @format date-time
     */
    created_at?: string;
    /**
     * Updated at
     * @format date-time
     */
    updated_at?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
    securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D;
    error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = "https://sberzabeg.stage.qortex.ru/api";
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private abortControllers = new Map<CancelToken, AbortController>();
    private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

    private baseApiParams: RequestParams = {
        credentials: "same-origin",
        headers: {
            Authorizations: `API_KEY ${import.meta.env.VITE_API_KEY}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig);
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key]);
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key];
        return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
        return keys
            .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
            .join("&");
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
        [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
        [ContentType.FormData]: (input: any) =>
            Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key];
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                            ? JSON.stringify(property)
                            : `${property}`,
                );
                return formData;
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    };

    protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }

        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken);

        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };

    public request = async <T = any, E = any>({
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken,
        ...params
    }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter = this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;

        return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
            },
            signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
            body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
        }).then(async (response) => {
            const r = response as HttpResponse<T, E>;
            r.data = null as unknown as T;
            r.error = null as unknown as E;

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                    .then((data) => {
                        if (r.ok) {
                            r.data = data;
                        } else {
                            r.error = data;
                        }
                        return r;
                    })
                    .catch((e) => {
                        r.error = e;
                        return r;
                    });

            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }

            if (!response.ok) throw data;
            return data;
        });
    };
}

/**
 * @title TEST API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl https://sberzabeg.stage.qortex.ru/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    getAllParticipantMetrics = {
        /**
         * No description
         *
         * @tags get-all-participant-metrics
         * @name GetAllParticipantMetricsList
         * @request GET:/get-all-participant-metrics/
         * @secure
         */
        getAllParticipantMetricsList: (params: RequestParams = {}) =>
            this.request<ParticipantMetrics, any>({
                path: `/get-all-participant-metrics/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    getCsvParticipantMetrics = {
        /**
         * No description
         *
         * @tags get-csv-participant-metrics
         * @name GetCsvParticipantMetricsList
         * @request GET:/get-csv-participant-metrics/
         * @secure
         */
        getCsvParticipantMetricsList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/get-csv-participant-metrics/`,
                method: "GET",
                secure: true,
                ...params,
            }),
    };
    getOnpointParticipantMetrics = {
        /**
         * No description
         *
         * @tags get-onpoint-participant-metrics
         * @name GetOnpointParticipantMetricsList
         * @request GET:/get-onpoint-participant-metrics/
         * @secure
         */
        getOnpointParticipantMetricsList: (params: RequestParams = {}) =>
            this.request<GetParticipantMetricsOnPoint, any>({
                path: `/get-onpoint-participant-metrics/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    getRealtimeParticipantMetrics = {
        /**
         * No description
         *
         * @tags get-realtime-participant-metrics
         * @name GetRealtimeParticipantMetricsList
         * @request GET:/get-realtime-participant-metrics/
         * @secure
         */
        getRealtimeParticipantMetricsList: (params: RequestParams = {}) =>
            this.request<GetParticipantMetricsRealtime, any>({
                path: `/get-realtime-participant-metrics/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    participantMetrics = {
        /**
         * No description
         *
         * @tags participant-metrics
         * @name ParticipantMetricsList
         * @request GET:/participant-metrics/
         * @secure
         */
        participantMetricsList: (params: RequestParams = {}) =>
            this.request<ParticipantMetrics[], any>({
                path: `/participant-metrics/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participant-metrics
         * @name ParticipantMetricsCreate
         * @request POST:/participant-metrics/
         * @secure
         */
        participantMetricsCreate: (data: ParticipantMetrics, params: RequestParams = {}) =>
            this.request<ParticipantMetrics, any>({
                path: `/participant-metrics/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participant-metrics
         * @name ParticipantMetricsRead
         * @request GET:/participant-metrics/{id}/
         * @secure
         */
        participantMetricsRead: (id: number, params: RequestParams = {}) =>
            this.request<ParticipantMetrics, any>({
                path: `/participant-metrics/${id}/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participant-metrics
         * @name ParticipantMetricsUpdate
         * @request PUT:/participant-metrics/{id}/
         * @secure
         */
        participantMetricsUpdate: (id: number, data: ParticipantMetrics, params: RequestParams = {}) =>
            this.request<ParticipantMetrics, any>({
                path: `/participant-metrics/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participant-metrics
         * @name ParticipantMetricsPartialUpdate
         * @request PATCH:/participant-metrics/{id}/
         * @secure
         */
        participantMetricsPartialUpdate: (id: number, data: ParticipantMetrics, params: RequestParams = {}) =>
            this.request<ParticipantMetrics, any>({
                path: `/participant-metrics/${id}/`,
                method: "PATCH",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participant-metrics
         * @name ParticipantMetricsDelete
         * @request DELETE:/participant-metrics/{id}/
         * @secure
         */
        participantMetricsDelete: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/participant-metrics/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    participants = {
        /**
         * No description
         *
         * @tags participants
         * @name ParticipantsList
         * @request GET:/participants/
         * @secure
         */
        participantsList: (params: RequestParams = {}) =>
            this.request<Participant[], any>({
                path: `/participants/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participants
         * @name ParticipantsCreate
         * @request POST:/participants/
         * @secure
         */
        participantsCreate: (data: Participant, params: RequestParams = {}) =>
            this.request<Participant, any>({
                path: `/participants/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participants
         * @name ParticipantsRead
         * @request GET:/participants/{id}/
         * @secure
         */
        participantsRead: (id: number, params: RequestParams = {}) =>
            this.request<Participant, any>({
                path: `/participants/${id}/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participants
         * @name ParticipantsUpdate
         * @request PUT:/participants/{id}/
         * @secure
         */
        participantsUpdate: (id: number, data: Participant, params: RequestParams = {}) =>
            this.request<Participant, any>({
                path: `/participants/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participants
         * @name ParticipantsPartialUpdate
         * @request PATCH:/participants/{id}/
         * @secure
         */
        participantsPartialUpdate: (id: number, data: Participant, params: RequestParams = {}) =>
            this.request<Participant, any>({
                path: `/participants/${id}/`,
                method: "PATCH",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags participants
         * @name ParticipantsDelete
         * @request DELETE:/participants/{id}/
         * @secure
         */
        participantsDelete: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/participants/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    updateMetrics = {
        /**
         * No description
         *
         * @tags update-metrics
         * @name UpdateMetricsCreate
         * @request POST:/update-metrics/
         * @secure
         */
        updateMetricsCreate: (data: ParticipantUpdateMetrics, params: RequestParams = {}) =>
            this.request<ParticipantUpdateMetrics, any>({
                path: `/update-metrics/`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };
}

