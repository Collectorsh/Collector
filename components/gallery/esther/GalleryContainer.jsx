import React, { useEffect, useContext, useState } from "react";
import Card from "/components/gallery/esther/Card";
import { roundToTwo } from "/utils/roundToTwo";
import EstimatedValueContext from "/contexts/estimated_value";

export default function GalleryContainer({ tokens, user }) {
  const [runningTotal, setRunningTotal] = useState(0);
  const [totalEstimate] = useContext(EstimatedValueContext);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  useEffect(() => {
    let total = totalEstimate.reduce((a, b) => a + (b["estimate"] || 0), 0);
    setRunningTotal(total);
  }, [totalEstimate]);

  const sections = [
    { title: "Esther and the Veiled Coast 1/1 Auction Prize Pool", items: 20 },
    { title: "Veiled Coast: Map Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 1 Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 2 Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 3 Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 4 Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 5 Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 6 Edition Prize Pool", items: 8 },
    { title: "Veiled Coast: Chapter 7 Edition Prize Pool", items: 8 },
  ];

  var position = 0;

  return (
    <div className="clear-both w-full mt-6">
      {user && user.estimated_value && (
        <div className="pb-8">
          <h2 className="text-base text-lg font-semibold leading-4 text-black dark:text-white inline">
            Estimated: ◎{roundToTwo(runningTotal / 1000000000)}
          </h2>
        </div>
      )}
      <div className="clear-both mb-12">
        {sections.map((section) => {
          const html = tokens
            .filter((t) => t.visible)
            .slice(position, position + section.items)
            .map((token, index) => {
              return (
                <div
                  key={index}
                  className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl"
                >
                  <Card key={index} token={token} user={user} size={350} />
                </div>
              );
            });
          position += section.items;
          return (
            <>
              <h1 className="text-4xl font-extrabold text-black dark:text-white text-center mb-8 pt-4">
                {section.title}
              </h1>
              {section.items === 20 ? (
                <>
                  <p className="text-black dark:text-white text-center my-4 text-sm max-w-6xl mx-auto">
                    To show our gratitude for Esther's support, we have created
                    a mammoth prize pool for{" "}
                    <a
                      href="https://www.esthersescape.xyz/esthers-fair-2"
                      target="_blank"
                      className="underline"
                    >
                      EF2
                    </a>
                    . With pieces graciously donated by up-and-coming artists,
                    Esther's Seven and donations from the Duel of Doves
                    collection.
                  </p>
                  <p className="text-black dark:text-white text-center my-4 text-sm">
                    <strong>To qualify:</strong> Bid on any of our 1/1 auctions
                    to gain a ticket into the 'Auction Prize Pool' (1 unique bid
                    per auction = 1 ticket). The raffle will be drawn within the
                    week of Esther Fair 2.
                  </p>
                  <p className="text-black dark:text-white text-center mt-4 mb-16 text-sm">
                    <a
                      href="https://formfunction.xyz/@esthersescape/series/ef2-esther-the-veiled-coast"
                      className="underline"
                    >
                      See our 1/1 auctions
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-black dark:text-white text-center my-4 text-sm">
                    <strong>To qualify:</strong> Buy one 'Veiled Coast
                    Soundtrack' edition and gain a ticket into the associated
                    'Edition Prize Pool' (No entry limits). The raffle will be
                    drawn within the week of Esther Fair 2.
                  </p>
                  <p className="text-black dark:text-white text-center mt-4 mb-16 text-sm">
                    <a
                      href="https://formfunction.xyz/@esthersescape/series/ef2-veiled-coast-soundtrack"
                      className="underline"
                    >
                      See our editions
                    </a>
                  </p>
                </>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start mb-16">
                {html}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
