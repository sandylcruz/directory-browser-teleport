const defaultOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

export const apiFetch = (
  url: string,
  params: Partial<RequestInit> = {}
): Promise<Response> => {
  const options: RequestInit = {
    ...defaultOptions,
    ...params,
  };

  return window.fetch(url, options);
};

export const baseJsonFetch = (
  url: string,
  params: Partial<RequestInit>
): Promise<Response> =>
  apiFetch(url, params).then((response) => {
    if (response.ok) {
      return response;
    } else {
      return response.json().then((json) => {
        throw new Error(json.error);
      });
    }
  });

// TODO: If we wanted better type safety here, we could also force the passing
// of a type predicate function to guarantee that the response really is of
// type T. But I'll leave that for another time.
export const fetchJson = <T>(
  url: string,
  params: Partial<RequestInit> = {}
): Promise<T> =>
  new Promise((resolve, reject) => {
    baseJsonFetch(url, params)
      .then((response) => response.json().then(resolve))
      .catch(reject);
  });
