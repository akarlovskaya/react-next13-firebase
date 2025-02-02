import { FaFacebookSquare, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
// import Spinner from "../components/Loader.jsx";

// Mapping social names to their corresponding icons
const iconMap = {
  facebook: <FaFacebookSquare />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedin />,
  x_com: <FaXTwitter />,
};

const SocialLinksProfileForm = ({
  socialLinks,
  // onSocialLinkChange,
  // editInfo,
}) => {
  console.log("socialLinks from ProfileForm", socialLinks);
  //   const [loading, setLoading] = useState(false);

  return (
    <>
      <fieldset>
        <legend className="font-semibold uppercase mb-2 mt-8">
          Social Accounts
        </legend>
        <div className="mb-4">
          {socialLinks.map((socialLink, index) => (
            <div key={index} className="relative flex gap-x-3 mb-4">
              <label
                htmlFor={socialLink.name}
                className="flex text-lg h-10 items-center"
              >
                {iconMap[socialLink.name] || <FaLink />}{" "}
                {/* Default icon if not found */}
              </label>
              <input
                type="text"
                id={socialLink.name}
                name={socialLink.name}
                className="border rounded w-full py-2 px-3"
                placeholder={`Link to ${socialLink.label} profile. Optional`}
                onChange={(e) => onSocialLinkChange(e, index)}
              />
            </div>
          ))}
        </div>
      </fieldset>
    </>
  );
};

export default SocialLinksProfileForm;
