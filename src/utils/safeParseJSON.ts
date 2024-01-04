const safeParseJSON = <TData>(jsonString: string): TData | null => {
  try {
    // remove leading and trailing ``` or ```json
    const trimmed = jsonString.trim().replace(/^```(json)?/, '').replace(/```$/, '');
    return JSON.parse(trimmed.trim()) as TData;
  } catch (err) {
    try {
      return JSON.parse(jsonString.trim()) as TData;
    } catch (err1) {
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
  }
};

export default safeParseJSON;
