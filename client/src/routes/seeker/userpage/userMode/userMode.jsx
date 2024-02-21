import "./userMode.css";
import PropTypes from "prop-types";


export default function UserMode({userData}){

    return(
    <>
        {userData && (
        <section className="sec intro-sec">
         <div className="intro-vid">
           <h2>Introduction</h2>
             <video controls>
               <source src={userData.introduction} type="video/mp4" />
               Your browser does not support the video tag.
             </video>
         </div>
         <div className="education">
           <h2>Education</h2>
           {userData.education.map((education, index) => (
             <div className="education-text" key={index}>
               <h4>{education.level}</h4>
               <h4>{education.name}</h4>
               <h4>{education.score}</h4>
             </div>
           ))}
         </div>
         <div className="skill-vid">
           <h2>Skills</h2>
           <video controls>
              <source src={userData.skills} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
         </div>
        </section>
        )}
        
        {userData && (
         <section className="middle">
             <section className="middle-container">
                 <div className="sec challenges-sec">
                   <h2>Challenges</h2>
                   <video  controls>
                      <source src={userData.challenges} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                 </div>
                 <aside className="Maybolin-AI">
                   <p>Keep on looking. You will find it! - Maybolin AI</p>
                 </aside>
             </section>
         </section>
        )}
        
        {userData && (
        <section className="sec references-sec">
         <h2>References</h2>
         {userData.references.map((reference, index) => (
           <div className="reference-item" key={index}>
             <div className="top-company">
               <h3 className="company-name">{reference.name}, {reference.company},</h3>
               <h3 className="company-email">{reference.email}</h3>
             </div>
             <p>
               {reference.desc}
             </p>
           </div>
         ))}
        </section>
        )}
        </>
    )
}


UserMode.propTypes = {
  userData: PropTypes.shape({
    education: PropTypes.arrayOf(PropTypes.shape({
        level: PropTypes.string,
        name: PropTypes.string,
        score: PropTypes.string, 
    })),
    references: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        company: PropTypes.string,
        email: PropTypes.string,
        desc: PropTypes.string,
    })),
    challenges: PropTypes.array,
    skills: PropTypes.array,
    introduction: PropTypes.string,
    banner: PropTypes.string,
    pictureURL: PropTypes.string,
    displayName: PropTypes.string,
  }).isRequired,
    iconSize: PropTypes.string,
  };




