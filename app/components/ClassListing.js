import Link from 'next/link';
import {FaMapMarker} from 'react-icons/fa';
// import Moment from 'react-moment';
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

function ClassListing({ workout, admin = false })  {
  return (
    <div>
      <Link href={`/${workout.username}`}>
        <a>
          <strong>By @{workout.username}</strong>
        </a>
      </Link>

      <Link href={`/${workout.username}/${workout.slug}`}>
        <h2>
          <a>{workout.title}</a>
        </h2>
      </Link>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${workout.slug}`}>
            <h3>
              <button>Edit</button>
            </h3>
          </Link>

          {workout.published ? <p>Live</p> : <p>Unpublished</p>}
        </>
      )}
    </div>
  );
}

export default ClassListing;