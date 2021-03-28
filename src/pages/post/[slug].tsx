import { GetStaticPaths, GetStaticProps } from 'next';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <main className={styles.container}>
        <article className={styles.content}>
          <h1>{post.data.title}</h1>
          <div>
            <FiCalendar />
            <time>
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
            <FiUser />
            <span>{post.data.author}</span>
            <FiClock />
            <span>30 min</span>
          </div>
          {post.data.content.map(content => (
            <>
              <strong key={content.heading}>{content.heading}</strong>
              {content.body.map(body => (
                <p>{body.text}</p>
              ))}
            </>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking',
  };
  // TODO
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: response.data,
  };

  // TODO
  return {
    props: {
      post,
    },
  };
};
