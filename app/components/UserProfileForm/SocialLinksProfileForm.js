import { useFormContext } from "react-hook-form";
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaLink,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Mapping social names to their corresponding icons
const iconMap = {
  facebook: <FaFacebookSquare />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedin />,
  x_com: <FaXTwitter />,
  tiktok: <FaTiktok />,
};

const SocialLinksProfileForm = ({ socialLinks }) => {
  const { register } = useFormContext();

  return (
    <>
      <fieldset>
        <legend className="font-semibold uppercase mb-2 mt-12">
          Social Accounts
        </legend>
        <div className="mb-4">
          {socialLinks.map((socialLink) => (
            <div key={socialLink.name} className="relative flex gap-x-3 mb-4">
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
                className="border rounded w-full py-2 px-3"
                placeholder={`Link to ${socialLink.name} profile. Optional`}
                defaultValue={socialLink.link}
                {...register(`socialLinks.${socialLink.name}`)}
              />
            </div>
          ))}
        </div>
      </fieldset>
    </>
  );
};

export default SocialLinksProfileForm;

// To do: Dynamic Inputs using useFieldArray from react-hook-form
