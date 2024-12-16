

function UserProfile({ user }) {
    // console.log('displayName: ', displayName);
  return (
    <div>      
        UserProfile Component
        <img src={user.photoURL || '/avatar-img.png'} />
        <p>
        <i>@{user.username}</i>
        </p>
        <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
  )
}

export default UserProfile;