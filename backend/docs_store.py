# docs_store.py
# Simple TF-IDF based document store for RAG.
import os
import glob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class DocsStore:
    def __init__(self, docs_dir="data/docs"):
        self.docs_dir = docs_dir
        os.makedirs(self.docs_dir, exist_ok=True)
        self.docs = []
        self._vectorizer = None
        self._mat = None
        self.load_docs()

    def load_docs(self):
        paths = sorted(glob.glob(os.path.join(self.docs_dir, "*")))
        self.docs = []

        for p in paths:
            try:
                with open(p, "r", encoding="utf-8") as f:
                    text = f.read().strip()
            except Exception:
                text = ""
            self.docs.append({"id": os.path.basename(p), "text": text})

        # Only fit TF-IDF if there is some non-empty text
        texts = [d["text"] for d in self.docs if d["text"].strip()]
        if texts:
            self._vectorizer = TfidfVectorizer(stop_words="english").fit(texts)
            self._mat = self._vectorizer.transform(texts)
        else:
            self._vectorizer = None
            self._mat = None

    def add_doc(self, filename: str, text: str):
        path = os.path.join(self.docs_dir, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        self.load_docs()

    def get_top_k(self, query: str, k: int = 3):
        if not self.docs or not self._vectorizer:
            return []
        qv = self._vectorizer.transform([query])
        sims = cosine_similarity(qv, self._mat)[0]
        idx = sims.argsort()[::-1][:k]
        return [self.docs[i] for i in idx]
