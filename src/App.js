import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardColumns,
  Button,
} from "react-bootstrap";
import GithubCorner from "react-github-corner";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";

const api = "/api/books";

function Paging({ page, setPage, data }) {
  return (
    <Row className="text-center paging">
      <Col>
        <Button
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          back
        </Button>
        <span className="pageNumber">
          Page {page} / {Math.ceil(data.count / 20)}
        </span>
        <Button
          size="sm"
          disabled={page >= Math.ceil(data.count / 20)}
          onClick={() => setPage(page + 1)}
        >
          next
        </Button>
      </Col>
    </Row>
  );
}

const githubCommit =
  "https://github.com/domfyi/ontrack/commit/7b197668cbff297bf3abe0b95b44dced1a82baa7";

function App() {
  const [page, setPage] = useQueryParam("page", NumberParam, 1);
  if (!page) setPage(1);
  const [query, setQuery] = useQueryParam("query", StringParam);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () =>
      (async () => {
        setIsLoading(true);
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page,
            filters: [{ type: "all", values: [query || ""] }],
          }),
        });
        const json = await res.json();
        setData(json);
        setIsLoading(false);
      })(),
    [page, query]
  );
  return (
    <Container fluid="md">
      <GithubCorner href={githubCommit} />
      <div className="header">
        <Row className="text-center">
          <Col>
            <h1>Book Search!</h1>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <input
              placeholder="Title or Author"
              defaultValue={query}
              onKeyUp={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </Col>
        </Row>
      </div>
      {!!data?.books?.length && <Paging {...{ page, setPage, data }} />}
      <Row style={{ opacity: isLoading ? 0.2 : 1 }}>
        {!!query && !data?.books?.length && <h2>No results.</h2>}
        <CardColumns>
          {data?.books?.map((book) => (
            <Card>
              <Card.Body style={{ padding: "1rem" }}>
                <Card.Title>{book.book_title}</Card.Title>
                <Card.Text
                  style={{
                    color: "#1D7874",
                  }}
                >
                  - {book.book_author.join(", ")}
                </Card.Text>
              </Card.Body>

              <Card.Footer>
                <small className="text-muted">
                  Published {book.book_publication_year} in{" "}
                  {book.book_publication_country}
                </small>
              </Card.Footer>
            </Card>
          ))}
        </CardColumns>
      </Row>
      {!!data?.books?.length && <Paging {...{ page, setPage, data }} />}
    </Container>
  );
}

export default App;
