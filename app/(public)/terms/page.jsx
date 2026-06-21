// app/terms-of-use/page.jsx
import LegalPage from "@/components/LegalPage";
import termsOfUseData from "@/data/terms-of-use.json";

export const metadata = {
  title: termsOfUseData.title,
  description: termsOfUseData.description,
};

export default function TermsOfUse() {
  const renderContent = (contentArray) => {
    return contentArray.map((item, index) => {
      switch (item.type) {
        case "paragraph":
          return (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          );
        case "list":
          return (
            <ul key={index}>
              {item.items.map((listItem, i) => (
                <li
                  key={i}
                  dangerouslySetInnerHTML={{ __html: listItem }}
                />
              ))}
            </ul>
          );
        case "subheading":
          return (
            <h3 key={index}>{item.text}</h3>
          );
        case "table":
          return (
            <div className="legal-table-wrap" key={index}>
              <table>
                <thead>
                  <tr>
                    {item.headers.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <LegalPage title="Terms of Use" lastRevised={termsOfUseData.lastRevised}>
      {termsOfUseData.sections.map((section) => (
        <div key={section.id}>
          {section.title && <h2>{section.title}</h2>}
          {renderContent(section.content)}
        </div>
      ))}
    </LegalPage>
  );
}