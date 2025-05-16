import CardList from "../components/cardList/cardList";
import CategoryList from "../components/categoryList/categoryList";
import Featured from "../components/featured/featured";
import Menu from "../components/menu/menu";
import styles from "./blogMC.module.css"

export default function BlogHome() {
  return (
    <main className={styles.container}>
      <Featured />
      <CategoryList />
      <div className={styles.content}>
        <CardList />
      </div>
    </main>
  );
}