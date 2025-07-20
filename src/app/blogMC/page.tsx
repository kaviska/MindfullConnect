import CardList from "../components/cardList/cardList";
import CategoryList from "../components/categoryList/categoryList";
import Featured from "../components/featured/featured";
import { Suspense } from 'react'
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";

import styles from "./blogMC.module.css"

export default function BlogHome() {
  return (
    <>
    <Nav />
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.container}>
        <Featured />
        <CategoryList />
        <div className={styles.content}>
          <CardList />
        </div>
      </main>
    </Suspense>
    <Footer />
    </>
  );
}