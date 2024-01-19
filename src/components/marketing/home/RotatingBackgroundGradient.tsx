const RotatingBackgroundGradient = () => {
  return (
    <div
      style={{
        transformOrigin: "top",
      }}
      aria-hidden="true"
      className="animate-hero absolute -z-10 opacity-50 w-full h-full top-0 left-0"
    >
      <div
        style={{
          height: "300px",
          width: "300px",
          filter: "blur(300px)",
          left: "0",
          top: "40%",
        }}
        className="bg-hotPink-100"
      />
      <div
        style={{
          height: "300px",
          width: "300px",
          filter: "blur(300px)",
          right: "0",
          top: "0",
        }}
        className="bg-orange-600"
      />
    </div>
  );
};

export default RotatingBackgroundGradient;
