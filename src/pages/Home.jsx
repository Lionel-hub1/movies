import { ICONS } from "../data/constants";

const Home = () => {
  return (
    <div className="text-bodyText mx-20">
      <div className="relative h-[45rem]">
        <div className="absolute flex flex-col h-[26rem] w-[50%] bottom-0">
          <span className="w-20 bg-primaryDark"></span>
          <span className="font-['Bebas_Neue'] text-7xl font-normal">
            Find movies
          </span>
          <span className="font-['Bebas_Neue'] text-8xl font-normal top-grad">
            TV shows and more
          </span>
          <p className="pr-10  w-[67ch]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis
            nisi nesciunt, exercitationem voluptatibus dolores ea consequuntur,
            incidunt commodi odio minima alias voluptas itaque eaque, aliquid
            et. Explicabo deserunt non necessitatibus.
          </p>
        </div>
        <div className="absolute flex flex-col h-[45rem] w-[50%] bottom-0 right-0">
          <div className="relative flex w-full h-full items-center justify-center">
            <div className="absolute w-[28rem] bottom-0 left-0 z-10">
              <div className="relative w-full h-full">
                <img
                  className="absolute top-0 bottom-0 my-auto right-0 left-0 mx-auto w-30 h-30 object-cover"
                  src={ICONS.playIc}
                  alt=""
                />
                <img
                  className="w-full h-full object-cover"
                  src={ICONS.topFrontImg}
                  alt=""
                />
              </div>
            </div>
            <img
              className="absolute w-[28rem] top-0 right-0"
              src={ICONS.topBackImg}
              alt=""
            />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Home;
