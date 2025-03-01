export default function Thanks() {
  return (
    <div className=" h-full border rounded-xl  m-2 flex flex-col items-center justify-center ">
      <div className="text-center flex flex-col gap-6 items-center py-6 px-6 sm:py-8 sm:px-10 md:py-10 md:px-14 lg:py-12 lg:px-14 rounded-2xl  bg-grayscale-light-background  w-full max-w-lg sm:max-w-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="font-extrabold text-2xl sm:text-3xl md:text-[40px]">
            Great Job
          </h1>
          <img
            src="/assets/icons/raising-hands.svg"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-[44px] md:w-[44px]"
            alt="raising hands icon"
          />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          Thanks for taking the interview.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Our team will get back to you soon after the review.
        </p>
      </div>
    </div>
  );
}
