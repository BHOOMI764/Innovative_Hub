export default function AboutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">About Innovative Hub</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Welcome to Innovative Hub, a platform dedicated to showcasing and celebrating innovative projects that contribute to the United Nations Sustainable Development Goals (SDGs).
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-6">
          We aim to create a community-driven platform where innovators, researchers, and organizations can share their projects that address global challenges. By connecting these initiatives with the SDGs, we help track and promote sustainable development efforts worldwide.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Project showcase and discovery</li>
          <li>SDG alignment tracking</li>
          <li>Community engagement and collaboration</li>
          <li>Recognition for impactful initiatives</li>
          <li>Knowledge sharing and learning</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Get Involved</h2>
        <p className="mb-6">
          Whether you're an innovator looking to showcase your project, a researcher seeking collaboration opportunities, or an organization wanting to support sustainable development initiatives, there's a place for you in our community.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you. Reach out to us at:
          <br />
          <a href="mailto:contact@innovativehub.com" className="text-blue-600 hover:underline">
            contact@innovativehub.com
          </a>
        </p>
      </div>
    </div>
  );
} 