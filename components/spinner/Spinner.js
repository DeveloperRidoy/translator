import styles from './spinner.module.css'; 

const Spinner = ({classsName}) => {
    return (
      <div className={`scale-[.3] ${styles["lds-ring"]} ${classsName}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
}
 
export default Spinner
