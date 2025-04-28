const defaultEndpoint = "/api/openai-proxy";
export const defaultAPIEndpoint = import.meta.env.VITE_DEFAULT_API_ENDPOINT || defaultEndpoint;

export const _builtinAPIEndpoint = defaultAPIEndpoint;
export const _developmentAPIEndpoint = defaultAPIEndpoint;

export const availableEndpoints = [_builtinAPIEndpoint, _developmentAPIEndpoint];
