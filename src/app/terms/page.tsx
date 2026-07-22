import { readFileSync } from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import Layout from '@/components/Layout';

export const metadata = {
  title: 'الشروط والأحكام | Terms and Conditions',
};

export default async function TermsPage() {
  const filePath = join(process.cwd(), 'mdfiles', 'terms.md');
  const markdown = readFileSync(filePath, 'utf8');
  const processed = await remark().use(html).process(markdown);
  const content = processed.toString();

  return (
    <Layout>
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-dark mb-8 text-center">
              الشروط والأحكام
            </h1>
            <div
              className="text-gray-700 leading-relaxed
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
                [&_p]:mb-4
                [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:mb-4
                [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4
                [&_li]:mb-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
