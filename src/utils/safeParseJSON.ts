const safeParseJSON = <TData>(jsonString: string): TData | null => {
  try {
    return JSON.parse(jsonString) as TData;
  } catch (error) {
    try {
      return JSON.parse(`${jsonString}}`) as TData; // sometimes it's missing a closing bracket
    } catch (err2) {
      return null;
    }
  }
};

export default safeParseJSON;
