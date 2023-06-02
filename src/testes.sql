-- SQLite

SELECT * FROM Vacinacoes;

SELECT AVG(total_animais) AS media_geral
FROM (
    SELECT C AS data_entrada, COUNT(*) AS total_animais
    FROM animais AS a
    JOIN entradas AS e ON e.id = a.entrada_id
    WHERE e.data_entrada >= '2023-01-01' -- Data inicial do período selecionado
    AND e.data_entrada <= '2023-06-01' -- Data final do período selecionado
    GROUP BY e.data_entrada
) AS subquery;

SELECT g.nome, AVG(total_animais) AS media_diaria
FROM (
    SELECT g.nome as nome, COUNT(*) AS total_animais
    FROM animais a,
    entradas e,
    galpoes g
    WHERE e.galpao_id = g.id
    AND e.id = a.entrada_id
    AND e.data_entrada >= '2023-01-01' -- Data inicial do período selecionado
    AND e.data_entrada <= '2023-06-01' -- Data final do período selecionado
    GROUP BY g.nome
) AS subquery
JOIN galpoes AS g ON g.nome = subquery.nome
GROUP BY g.nome;

SELECT g.nome, COUNT(*)
FROM galpoes g,
animais a,
entradas e
WHERE g.id = e.galpao_id
AND a.entrada_id = e.id
GROUP BY g.nome;

SELECT COUNT(*) AS total_animais
FROM animais AS a
JOIN entradas AS e ON e.id = a.entrada_id
WHERE strftime('%Y-%m', e.data_entrada) = strftime('%Y-%m', 'now');


SELECT l.lote, l.data_vencimento
FROM lotes l,
vacinas v
WHERE l.vacinaid = v.id
AND v.id = 1
ORDER BY l.data_vencimento;

SELECT v.nome, COUNT(*) as quantidade
FROM vacinas v,
lotes l,
Vacinacoes va
WHERE v.id = l.vacinaid 
AND va.lote_id = l.id
AND va.data_vacinacao > :inicio
AND va.data_vacinacao < :termino
GROUP BY v.nome;

SELECT c.nome, SUM(v.preco) as valor_total
FROM clientes c,
vendas v
WHERE v.cliente_id = c.id
AND v.data_venda > :inicio
AND v.data_venda < :termino
GROUP BY c.nome;


SELECT strftime('%Y-%m', v.data_venda), AVG(a.peso)
FROM animais a,
vendas v,
itemDeVenda iv
WHERE v.id = iv.venda_id
AND iv.animal_id = a.id
AND v.data_venda > :inicio
AND v.data_venda < :termino
GROUP BY strftime('%Y-%m', v.data_venda);