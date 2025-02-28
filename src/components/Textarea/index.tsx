import styles from './styles.module.css';
import { HTMLProps } from 'react';

const Textarea = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
  return <textarea className={styles.textArea} {...rest}></textarea>;
};

export default Textarea;
