
const HomePageCard = ({children, bg = 'bg-gray-50'}) => {
    return (
      <div className={`${bg} p-6 rounded-lg shadow-md`}>
        {children}
      </div>
    )
  }
  
  export default HomePageCard;