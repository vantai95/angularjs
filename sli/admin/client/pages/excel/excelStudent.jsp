<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=student_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>엑셀 다운로드</title>
<style>
.table-wrapper-scroll-y {
    display: block;
    max-height: 700px;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
</style>
</head>
<body>
    <table style="background: #ffffff">
        <thead>
            <tr>
				<th>No</th>
				<th>수강생</th>
				<th>성별</th>
				<th>레벨테스트</th>
				<th>출석률</th>
				<th>성취도평가</th>
				<th>수료여부</th>
            </tr>
        </thead>
        <tbody>
        	<c:forEach var="x" items="${list}" varStatus="status">
                <tr>
                    <td>${status.count }</td>
					<td>${x.userName}</td>
					<td>${x.genderNm}</td>
					<td><fmt:formatNumber value="${x.scoreLv}" pattern="#,###.0" /></td>
					<td>${x.attendRate}</td>
					<td><fmt:formatNumber value="${x.scoreAc}" pattern="#,###.0" /></td>
					<td>${x.completeNm}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
