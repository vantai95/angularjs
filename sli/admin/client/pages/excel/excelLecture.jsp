<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
    <%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=lecture_" + today + ".xls");
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
                <th>강의코드</th>
                <th>과목</th>
                <th>구분</th>
                <th>강의명</th>
                <th>강사명</th>
                <th>고객사명</th>
                <th>수강료</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>인원</th>
                <th>개시여부</th>
                <th>상태</th>
            </tr>
        </thead>
        <tbody>
        	<c:forEach var="x" items="${list}" varStatus="status">
                <tr>
                    <td>${status.count }</td>
                    <td>${x.ltCd}</td>
                    <td>${x.sjCdNm}</td>
                    <td>${x.lectureSortNm}</td>
                    <td>${x.lectureNm}</td>
                    <td>${x.tcCdNm}</td>
					<td>${x.cpCdNm }</td>
					<td>${x.tuitionFee }</td>
					<td>${x.startDt }</td>
					<td>${x.endDt }</td>
					<td>${x.studentLimit }/${x.completAttendance}</td>
					<td>${x.useYn }</td>
					<td>${x.stateFlagNm }</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
