import about from "@/data/about-us.json";

export default function AboutPage() {
  return (
    <section className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">About Us</h1>
        <p className="max-w-3xl text-muted-foreground">
          Learn more about our newsroom, our mission, and the people behind our reporting.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{about.history.title}</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          {about.history.body}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{about.objective.title}</h2>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          {about.objective.body}
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Our Team</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.team.map((member) => (
            <article key={member.email} className="space-y-3 rounded-lg border p-4">
              <img
                src={member.image}
                alt={member.name}
                className="aspect-square w-full rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div className="text-sm">
                <p>{member.email}</p>
                <p>{member.phone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <div className="text-muted-foreground">
          <p>Email: {about.contact.email}</p>
          <p>Phone: {about.contact.phone}</p>
          <p>Address: {about.contact.address}</p>
          <p>Location: {about.contact.location}</p>
        </div>
      </section>
    </section>
  );
}