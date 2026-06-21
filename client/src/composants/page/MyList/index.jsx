import AccountSidebar from "../AccountSidebar/index.jsx";
import MyListItems from "./myListItem.jsx";
import { useContext } from "react";
import { MyContext } from "../../../router";

export default function MyList() {
  const context = useContext(MyContext);
  const myListItems = context.myListItems || [];

  return (
    <section className="!py-10 w-full">
      <div className="w-[95%] !mx-auto flex gap-5">
        <div className="col1 w-[20%]">
          <AccountSidebar />
        </div>
        <div className="col2 w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-5 !px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Mes Favoris</h2>
              <p className="!mt-0 !mb-0">
                Il y'a <span className="text-primary font-bold">{myListItems.length}</span> produit(s) dans votre liste de favoris
              </p>
            </div>

            {myListItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center !py-20 gap-4">
                <p className="text-gray-400 text-[16px]">Votre liste de favoris est vide</p>
              </div>
            ) : (
              myListItems.map((item) => <MyListItems key={item._id} item={item} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


{/*import AccountSidebar from "../AccountSidebar/index.jsx";
import MyListItems from "./myListItem.jsx";

export default function MyList(){
    return(
        <>
        <section className="!py-10 w-full">
             <div className="w-[95%] !mx-auto flex gap-5">
            <div className="col1 w-[20%]">
                <AccountSidebar/>
            </div>
             <div className="col2 w-[70%]">
                <div className='shadow-md  rounded-md bg-white'>
                        <div className="!py-5 !px-3 border-b border-[rgba(0,0,0,0.1)]">
                              <h2>Mes Favoris</h2>
                              <p className="!mt-0 !mb-0">
                                 Il y'a <span className="text-primary font-bold">5</span>{" "} produits dans votre liste de favoris
                               </p>
                         </div>

                            <MyListItems />
                             <MyListItems />
                              <MyListItems />
                               <MyListItems />
                                <MyListItems />
                                 <MyListItems/>
                        </div>
             </div>
        </div>
       </section>
       
        </>
    );
}*/}