const safeParseJSON = <TData>(jsonString: string): TData | null => {
  try {
    return JSON.parse(jsonString) as TData;
  } catch (error) {
    try {
      return JSON.parse(`${jsonString}}`) as TData; // sometimes it's missing a closing curly bracket
    } catch (err2) {
      try {
        return JSON.parse(`${jsonString}]`) as TData; // maybe it's missing a closing brace
      } catch (err3) {
        return null;
      }
    }
  }
};

export default safeParseJSON;
