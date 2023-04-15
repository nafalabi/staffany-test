import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useQueryData = <T extends ReadonlyArray<string>>(
  params: T
): {
  query: Record<T[number], string>;
  handleUpdateQuery: (update: Partial<typeof query>) => void;
} => {
  const history = useHistory();
  const { search, pathname } = useLocation();

  const query = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return params.reduce((obj: any, val) => {
      obj[val] = searchParams.get(val);
      return obj;
    }, {}) as Record<T[number], string>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpdateQuery = (update: Partial<typeof query>) => {
    const newQuery = {
      ...query,
      ...update,
    } as Record<string, string>;
    const searchParams = new URLSearchParams(newQuery);
    history.replace(pathname + "?" + searchParams.toString());
  };

  return {
    query,
    handleUpdateQuery,
  };
};

export default useQueryData;
