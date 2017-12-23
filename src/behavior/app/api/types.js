/*
 * @flow
 */

//-----------------
// BEGIN API ERRORS
//-----------------

export type ApiError = { +detail: string };

export type ApiErrors = Array<ApiError> | null;

//---------------
// END API ERRORS
//---------------

//-------------
// BEGIN ENTITY
//-------------

export type ResourceRelationship = { +id: string, +type: string };

export type ResourceRelationshipWrapper = { +data: ResourceRelationship };

export type ResourceRelationships = { +[relName: string]: ResourceRelationshipWrapper };

export type CreateResourcePayload = {
  +relationships?: ResourceRelationships,
  +type: string
};

export type UpdateResourcePayload = CreateResourcePayload & { +id: string };

export type ResourcePayload =
  | CreateResourcePayload
  | UpdateResourcePayload;

export type ResourcePayloadWrapper = { +data: ResourcePayload };

export type ResourceObject = {
  +id: string,
  +relationships?: ResourceRelationships,
  +type: string
};

export type ResourceObjectCollection = Array<ResourceObject>;

//-----------
// END ENTITY
//-----------

//-------------------
// BEGIN HTTP REQUEST
//-------------------

export type HttpHeaders = { +[headerName: string]: string };

export type HttpQueryUnit = { +id?: string, +include?: string };

export type HttpQueryCollection = {
  +'page[number]': number,
  +'page[size]': number,
  +sort: string
};

export type HttpQuery = {
  +collection?: HttpQueryCollection,
  +unit?: HttpQueryUnit
};

export type HttpResource = {
  +headers?: HttpHeaders,
  +method: string,
  +payload?: ResourcePayloadWrapper,
  +query?: HttpQuery,
  +url: string
};

export type HttpRequest = {
  +errorCb?: () => mixed,
  +killCache?: boolean,
  +resource: HttpResource,
  +successCb?: () => mixed
};

//-----------------
// END HTTP REQUEST
//-----------------

//--------------------
// BEGIN HTTP RESPONSE
//--------------------

export type HttpResponseLinks = { +first?: string, +last?: string };

export type HttpResponseMeta = { +'total-pages': number, +'total-records': number };

export type HttpResponse<ResponsePayload> = {
  +data?: ResponsePayload,
  +included?: ResourceObjectCollection,
  +links?: HttpResponseLinks,
  +meta?: HttpResponseMeta
};

export type HttpResponseWithQuery<Payload> = {
  +query: HttpQuery,
  +response: HttpResponse<Payload>
};

//------------------
// END HTTP RESPONSE
//------------------

//-------------------
// BEGIN HTTP FETCHER
//-------------------

export type HttpFetcher<ResponsePayload> = (
  resource: HttpResource
) => Promise<HttpResponse<ResponsePayload>>;

//-----------------
// END HTTP FETCHER
//-----------------
