const handleUrlInputOnChange =
  (setter: (text: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > "https://".length && !value.startsWith("https://")) {
      setter(`https://${e.target.value}`);
    } else if (!e.target.value) {
      setter("https://");
    } else {
      setter(e.target.value);
    }
  };

export default handleUrlInputOnChange;
