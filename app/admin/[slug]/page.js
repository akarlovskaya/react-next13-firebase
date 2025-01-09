import styles from '../../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import WorkoutPostManager from '../../components/WorkoutPostManager';

const AdminWorkoutEditPage = ({ params }) => {

  const { slug } = params; // Accessing slug directly

  return (
    <div className={styles.container}>
      AdminWorkoutEditPage
      <AuthCheck>
        <WorkoutPostManager slug = { slug }/>
      </AuthCheck>
    </div>
  )
}

export default AdminWorkoutEditPage;
