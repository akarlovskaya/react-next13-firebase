import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaLink,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialLinks = ({ socialLinks }) => {
  const normalizeLink = (link) => {
    // Remove any leading/trailing spaces
    let normalizedLink = link.trim();

    // If the link starts with neither 'http' nor 'https', add 'https://'
    if (
      !normalizedLink.startsWith("http://") &&
      !normalizedLink.startsWith("https://")
    ) {
      normalizedLink = "https://" + normalizedLink;
    }

    return normalizedLink;
  };

  const hasNonEmptyLink = socialLinks.some((link) => link.link.trim() !== "");

  return (
    <>
      {hasNonEmptyLink && (
        <>
          <h3 className="text-gray-700 font-bold">Find me on socials:</h3>
          <ul className="flex justify-left items-center gap-3 my-3">
            {socialLinks.map(
              (socialLink) =>
                socialLink.link !== "" && (
                  <li
                    key={socialLink.name}
                    className="text-xl content-center mr-2 hover:text-orange-dark"
                  >
                    <a
                      href={normalizeLink(socialLink.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {renderSocialIconSwitch(socialLink.name)}{" "}
                      {/* Render the icon */}
                    </a>
                  </li>
                )
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default SocialLinks;

const renderSocialIconSwitch = (socialLink) => {
  switch (socialLink) {
    case "facebook":
      return <FaFacebookSquare />;
    case "instagram":
      return <FaInstagram />;
    case "x_com":
      return <FaXTwitter />;
    case "linkedin":
      return <FaLinkedin />;
    case "tiktok":
      return <FaTiktok />;

    default:
      return <FaLink />;
  }
};
